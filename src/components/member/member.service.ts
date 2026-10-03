import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type ObjectId } from 'mongoose';
import { Member } from '../../libs/dto/member_dto/member';
import { AuthService } from '../auth/auth.service';
import { AuthenticationInput } from '../../libs/dto/member_dto/member.input';
import { Message } from '../../libs/enums/common.enum';
import {
  MemberAuth,
  MemberStatus,
  MemberType,
} from '../../libs/enums/member.enum';
import { AuthPayload } from '../../libs/dto/auth.payload';
import { StatisticModifier, T } from '../../libs/types/common';

// Member types a user may choose for themselves at signup
const SELF_ASSIGNABLE_TYPES = [
  MemberType.COLLECTOR,
  MemberType.SELLER,
  MemberType.GRADING_EXPERT,
];

const NICK_MIN = 3;
const NICK_MAX = 12;

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Single entry point for every auth method:
   * logs the member in if they are already registered, otherwise signs them up.
   */
  public async authenticate(input: AuthenticationInput): Promise<AuthPayload> {
    try {
      switch (input.memberAuth) {
        case MemberAuth.PHONE:
          return await this.authenticateWithPhone(input);

        case MemberAuth.GOOGLE: {
          const profile = await this.authService.verifyGoogleToken(
            this.requireToken(input, 'Google token is required'),
          );
          if (!profile.emailVerified) {
            throw new UnauthorizedException('Google email is not verified');
          }
          return await this.authenticateWithProvider(
            input,
            { googleId: profile.googleId },
            {
              memberEmail: input.memberEmail ?? profile.email,
              memberImage: profile.picture,
            },
            [profile.name, `user_${profile.googleId.slice(0, 7)}`],
          );
        }

        case MemberAuth.APPLE: {
          const profile = await this.authService.verifyAppleToken(
            this.requireToken(input, 'Apple token is required'),
          );
          // Apple only sends the user's name to the client, on the first sign in,
          // so the client should pass it as memberNick.
          return await this.authenticateWithProvider(
            input,
            { appleId: profile.appleId },
            {
              memberEmail:
                input.memberEmail ??
                (profile.emailVerified ? profile.email : undefined),
            },
            [`user_${profile.appleId.slice(0, 7)}`],
          );
        }

        case MemberAuth.TELEGRAM: {
          const profile = this.authService.verifyTelegramToken(
            this.requireToken(
              input,
              'Telegram authentication data is required',
            ),
          );
          return await this.authenticateWithProvider(
            input,
            { telegramId: profile.telegramId },
            {
              memberEmail: input.memberEmail,
              memberImage: profile.picture,
            },
            [
              profile.username,
              profile.firstName,
              `user_${profile.telegramId.slice(-7)}`,
            ],
          );
        }

        default:
          throw new BadRequestException('Unsupported authentication method');
      }
    } catch (err) {
      if (err instanceof HttpException) throw err;

      // Mongo duplicate key error (unique nick / phone / email)
      if ((err as { code?: number })?.code === 11000) {
        throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
      }

      console.error('AUTHENTICATE ERROR:', err);
      throw new BadRequestException(Message.SOMETHING_WENT_WRONG);
    }
  }

  // ---------- MEMBER ----------

  public async getMember(
    _memberId: ObjectId | null,
    targetId: ObjectId,
  ): Promise<Member> {
    const search: T = {
      _id: targetId,
      memberStatus: { $in: [MemberStatus.ACTIVE, MemberStatus.BLOCKED] },
    };
    const targetMember = await this.memberModel.findOne(search).lean().exec();
    if (!targetMember) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    return targetMember as Member;
  }

  /** Increments / decrements a counter field, e.g. memberAntiques +1 */
  public async memberStatsEditor(input: StatisticModifier): Promise<Member> {
    const { _id, targetKey, modifier } = input;
    return (await this.memberModel
      .findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        { returnDocument: 'after' },
      )
      .exec()) as Member;
  }

  // ---------- PHONE ----------

  private async authenticateWithPhone(
    input: AuthenticationInput,
  ): Promise<AuthPayload> {
    if (!input.memberPhone || !input.memberPassword) {
      throw new BadRequestException('Phone and password are required');
    }

    const existing = await this.memberModel
      .findOne({ memberPhone: input.memberPhone })
      .select('+memberPassword')
      .exec();

    // LOGIN
    if (existing) {
      this.assertCanLogin(existing);

      if (!existing.memberPassword) {
        throw new BadRequestException(Message.WRONG_PASSWORD);
      }
      const isMatch = await this.authService.comparePasswords(
        input.memberPassword,
        existing.memberPassword,
      );
      if (!isMatch) throw new BadRequestException(Message.WRONG_PASSWORD);

      return await this.buildPayload(existing);
    }

    // SIGNUP
    if (!input.memberNick) {
      throw new BadRequestException('Member nickname is required');
    }

    const member = await this.memberModel.create({
      ...this.signupBase(input),
      memberNick: input.memberNick,
      memberAuth: MemberAuth.PHONE,
      memberPhone: input.memberPhone,
      memberPassword: await this.authService.hashPassword(input.memberPassword),
      memberEmail: input.memberEmail,
    });

    return await this.buildPayload(member);
  }

  // ---------- GOOGLE / APPLE / TELEGRAM ----------

  private async authenticateWithProvider(
    input: AuthenticationInput,
    identity: Partial<Pick<Member, 'googleId' | 'appleId' | 'telegramId'>>,
    profileData: Partial<Member>,
    nickCandidates: (string | undefined)[],
  ): Promise<AuthPayload> {
    const existing = await this.memberModel.findOne(identity).exec();

    // LOGIN
    if (existing) {
      this.assertCanLogin(existing);
      return await this.buildPayload(existing);
    }

    // SIGNUP
    const memberNick = input.memberNick
      ? input.memberNick
      : await this.generateAvailableNick(nickCandidates);

    const member = await this.memberModel.create({
      ...this.signupBase(input),
      ...profileData,
      ...identity,
      memberNick,
      memberAuth: input.memberAuth,
    });

    return await this.buildPayload(member);
  }

  // ---------- HELPERS ----------

  private requireToken(input: AuthenticationInput, message: string): string {
    if (!input.token) throw new BadRequestException(message);
    return input.token;
  }

  /** Fields every new member gets, whatever the auth method */
  private signupBase(input: AuthenticationInput): Partial<Member> {
    const memberType = input.memberType ?? MemberType.COLLECTOR;
    if (!SELF_ASSIGNABLE_TYPES.includes(memberType)) {
      throw new ForbiddenException(Message.NOT_ALLOWED_REQUEST);
    }

    const base: Partial<Member> = { memberType };

    if (memberType === MemberType.GRADING_EXPERT) {
      if (!input.expertProfile) {
        throw new BadRequestException('Expert profile is required');
      }
      // verificationStatus defaults to PENDING in the schema
      base.expertProfile = {
        ...input.expertProfile,
      } as Member['expertProfile'];
    }

    return base;
  }

  private assertCanLogin(member: Member): void {
    switch (member.memberStatus) {
      case MemberStatus.BLOCKED:
        throw new ForbiddenException(Message.BLOCKED_USER);
      case MemberStatus.SUSPENDED:
        throw new ForbiddenException(Message.SUSPENDED_USER);
      case MemberStatus.DELETED:
        throw new ForbiddenException(Message.DELETED_USER);
    }
  }

  /** Turns a provider name into a valid, unused nickname (3-12 chars) */
  private async generateAvailableNick(
    candidates: (string | undefined)[],
  ): Promise<string> {
    for (const raw of candidates) {
      if (!raw) continue;
      const base = raw
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, NICK_MAX);
      if (base.length < NICK_MIN) continue;

      if (!(await this.memberModel.exists({ memberNick: base }))) return base;

      // Taken: try a few random suffixes
      for (let i = 0; i < 5; i++) {
        const suffix = Math.floor(1000 + Math.random() * 9000).toString();
        const nick = base.slice(0, NICK_MAX - suffix.length) + suffix;
        if (!(await this.memberModel.exists({ memberNick: nick }))) return nick;
      }
    }

    return `user${Math.floor(10000000 + Math.random() * 90000000)}`;
  }

  private async buildPayload(member: Member): Promise<AuthPayload> {
    const plain: Member = (member as any).toObject
      ? (member as any).toObject()
      : { ...member };
    delete (plain as Partial<Member>).memberPassword;

    const accessToken = await this.authService.createToken(plain);
    return { accessToken, member: plain };
  }
}

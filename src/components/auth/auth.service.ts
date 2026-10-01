import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { T } from '../../libs/types/common';
import { JwtService } from '@nestjs/jwt';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Member } from '../../libs/dto/member_dto/member';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public async hashPassword(memberPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(memberPassword, salt);
  }
  public async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  public async createToken(member: Member): Promise<string> {
    const payload: T = {};
    const source: any = (member as any)['_doc']
      ? (member as any)['_doc']
      : member;

    Object.keys(source).forEach((ele) => {
      payload[`${ele}`] = source[`${ele}`];
    });

    delete payload.memberPassword;
    console.log('payload->', payload);

    return await this.jwtService.signAsync(payload);
  }
  public async verifyToken(token: string): Promise<Member> {
    const member = await this.jwtService.verifyAsync(token);
    member._id = shapeIntoMongoObjectId(member._id);
    return member;
  }
}

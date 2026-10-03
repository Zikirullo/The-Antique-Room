import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { T } from '../../libs/types/common';
import { JwtService } from '@nestjs/jwt';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Member } from '../../libs/dto/member_dto/member';
import { UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import {
  createHash,
  createHmac,
  createPublicKey,
  timingSafeEqual,
  verify as verifySignature,
  type JsonWebKey,
} from 'node:crypto';

const APPLE_ISSUER = 'https://appleid.apple.com';
const APPLE_KEYS_URL = 'https://appleid.apple.com/auth/keys';
const APPLE_KEYS_TTL_MS = 60 * 60 * 1000; // 1 hour
const TELEGRAM_AUTH_MAX_AGE_SEC = 24 * 60 * 60; // 1 day

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

  // GOOGLE AUTH

  public async verifyGoogleToken(token: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid Google token');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  }

  // APPLE AUTH

  private appleKeys: {
    keys: (JsonWebKey & { kid: string })[];
    fetchedAt: number;
  } | null = null;

  private async getAppleKey(kid: string): Promise<JsonWebKey> {
    const isFresh =
      this.appleKeys &&
      Date.now() - this.appleKeys.fetchedAt < APPLE_KEYS_TTL_MS;
    let key = isFresh
      ? this.appleKeys!.keys.find((k) => k.kid === kid)
      : undefined;

    // Refetch when the cache is stale or Apple rotated its keys
    if (!key) {
      const res = await fetch(APPLE_KEYS_URL);
      if (!res.ok) {
        throw new UnauthorizedException('Could not fetch Apple public keys');
      }
      const body = (await res.json()) as {
        keys: (JsonWebKey & { kid: string })[];
      };
      this.appleKeys = { keys: body.keys, fetchedAt: Date.now() };
      key = body.keys.find((k) => k.kid === kid);
    }

    if (!key) throw new UnauthorizedException('Invalid Apple token');
    return key;
  }

  public async verifyAppleToken(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3)
      throw new UnauthorizedException('Invalid Apple token');
    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    let header: { kid?: string; alg?: string };
    let payload: T;
    try {
      header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString());
      payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
    } catch {
      throw new UnauthorizedException('Invalid Apple token');
    }

    if (header.alg !== 'RS256' || !header.kid) {
      throw new UnauthorizedException('Invalid Apple token');
    }

    const jwk = await this.getAppleKey(header.kid);
    const isValidSignature = verifySignature(
      'RSA-SHA256',
      Buffer.from(`${encodedHeader}.${encodedPayload}`),
      createPublicKey({ key: jwk, format: 'jwk' }),
      Buffer.from(encodedSignature, 'base64url'),
    );
    if (!isValidSignature)
      throw new UnauthorizedException('Invalid Apple token');

    const audiences = (process.env.APPLE_CLIENT_ID ?? '')
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    const now = Math.floor(Date.now() / 1000);

    if (payload.iss !== APPLE_ISSUER) {
      throw new UnauthorizedException('Invalid Apple token issuer');
    }
    if (!audiences.includes(payload.aud)) {
      throw new UnauthorizedException('Invalid Apple token audience');
    }
    if (typeof payload.exp !== 'number' || payload.exp < now) {
      throw new UnauthorizedException('Apple token has expired');
    }
    if (!payload.sub) throw new UnauthorizedException('Invalid Apple token');

    return {
      appleId: String(payload.sub),
      email: payload.email as string | undefined,
      // Apple sends email_verified as a boolean or as the string "true"
      emailVerified:
        payload.email_verified === true || payload.email_verified === 'true',
    };
  }

  // TELEGRAM AUTH
  // Accepts either:
  //  - Login Widget data: JSON string ({"id":..,"hash":..}) or query string (id=..&hash=..)
  //  - Mini App initData: query string containing user=<json>&hash=..

  public verifyTelegramToken(token: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new UnauthorizedException('Telegram auth is not configured');
    }

    const data = new Map<string, string>();
    const trimmed = token.trim();
    try {
      if (trimmed.startsWith('{')) {
        const json = JSON.parse(trimmed) as Record<string, unknown>;
        Object.entries(json).forEach(([k, v]) => {
          if (v !== undefined && v !== null) data.set(k, String(v));
        });
      } else {
        new URLSearchParams(trimmed).forEach((v, k) => data.set(k, v));
      }
    } catch {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }

    const hash = data.get('hash');
    if (!hash) throw new UnauthorizedException('Invalid Telegram auth data');
    data.delete('hash');

    const isMiniApp = data.has('user');
    const dataCheckString = [...data.keys()]
      .sort()
      .map((k) => `${k}=${data.get(k)}`)
      .join('\n');

    const secretKey = isMiniApp
      ? createHmac('sha256', 'WebAppData').update(botToken).digest()
      : createHash('sha256').update(botToken).digest();
    const expectedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const a = Buffer.from(expectedHash, 'hex');
    const b = Buffer.from(hash, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }

    const authDate = Number(data.get('auth_date'));
    const now = Math.floor(Date.now() / 1000);
    if (!authDate || now - authDate > TELEGRAM_AUTH_MAX_AGE_SEC) {
      throw new UnauthorizedException('Telegram auth data has expired');
    }

    let user: Record<string, unknown>;
    if (isMiniApp) {
      try {
        user = JSON.parse(data.get('user')!);
      } catch {
        throw new UnauthorizedException('Invalid Telegram auth data');
      }
    } else {
      user = Object.fromEntries(data);
    }

    if (!user.id) throw new UnauthorizedException('Invalid Telegram auth data');

    return {
      telegramId: String(user.id),
      username: user.username as string | undefined,
      firstName: user.first_name as string | undefined,
      picture: user.photo_url as string | undefined,
    };
  }
}

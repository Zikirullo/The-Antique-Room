import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';
import { MemberAuth, MemberStatus, MemberType } from '../../enums/member.enum';
import { availableMemberSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class ExpertSignupInput {
  //   @IsArray()
  //   @IsEnum(AntiqueCategory, { each: true })
  //   @Field(() => [AntiqueCategory])
  //   specialties: AntiqueCategory[];

  @IsNotEmpty()
  @Field(() => String)
  credentialsDesc: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  credentialsImages?: string[];

  @IsOptional()
  @Min(0)
  @Field(() => Int, { nullable: true })
  yearsOfExperience?: number;
}

@InputType()
export class MemberInput {
  @IsNotEmpty()
  @Length(3, 12)
  @Field(() => String)
  memberNick: string;

  @IsNotEmpty()
  @Field(() => MemberAuth)
  memberAuth: MemberAuth;

  @ValidateIf((o) => o.memberAuth === MemberAuth.PHONE)
  @IsNotEmpty()
  @Length(5, 12)
  @Field(() => String, { nullable: true })
  memberPassword?: string;

  @ValidateIf((o) => o.memberAuth === MemberAuth.PHONE)
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  memberPhone?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberEmail?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  googleId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  appleId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  telegramId?: string;

  @IsOptional()
  @Field(() => MemberType, { nullable: true })
  memberType?: MemberType;

  @ValidateIf((o) => o.memberType === MemberType.GRADING_EXPERT)
  @IsNotEmpty()
  @Field(() => ExpertSignupInput, { nullable: true })
  expertProfile?: ExpertSignupInput;
}

@InputType()
export class LoginInput {
  @IsNotEmpty()
  @Length(3, 12)
  @Field(() => String)
  memberNick: string;

  @IsNotEmpty()
  @Length(5, 12)
  @Field(() => String)
  memberPassword: string;
}

@InputType()
export class SocialLoginInput {
  @IsNotEmpty()
  @Field(() => MemberAuth)
  memberAuth: MemberAuth;

  @IsNotEmpty()
  @Field(() => String)
  token: string;
}

@InputType()
class MISearch {
  @IsOptional()
  @Field(() => MemberStatus, { nullable: true })
  memberStatus?: MemberStatus;

  @IsOptional()
  @Field(() => MemberType, { nullable: true })
  memberType?: MemberType;

  //   @IsOptional()
  //   @Field(() => AntiqueCategory, { nullable: true })
  //   specialty?: AntiqueCategory;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class MembersInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableMemberSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => MISearch)
  search: MISearch;
}

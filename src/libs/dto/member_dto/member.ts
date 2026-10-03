import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
  MemberType,
  MemberStatus,
  MemberAuth,
  VerificationStatus,
} from '../../enums/member.enum';
import { AntiqueCategory } from '../../enums/antique.enum';

@ObjectType()
export class ExpertProfile {
  @Field(() => [AntiqueCategory])
  specialties: AntiqueCategory[];

  @Field(() => String)
  credentialsDesc: string;

  @Field(() => [String], { nullable: true })
  credentialsImages?: string[];

  @Field(() => Int, { nullable: true })
  yearsOfExperience?: number;

  @Field(() => VerificationStatus)
  verificationStatus: VerificationStatus;

  @Field(() => String, { nullable: true })
  verifiedBy?: ObjectId;

  @Field(() => Date, { nullable: true })
  verifiedAt?: Date;

  @Field(() => String, { nullable: true })
  rejectionReason?: string;
}

@ObjectType()
export class Member {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ExpertProfile, { nullable: true })
  expertProfile?: ExpertProfile;

  @Field(() => MemberType)
  memberType: MemberType;

  @Field(() => MemberStatus)
  memberStatus: MemberStatus;

  @Field(() => MemberAuth)
  memberAuth: MemberAuth;

  @Field(() => String, { nullable: true })
  memberPhone?: string;

  @Field(() => String, { nullable: true })
  memberPassword: string;

  @Field(() => String, { nullable: true })
  appleId?: string;

  @Field(() => String, { nullable: true })
  memberEmail?: string;

  @Field(() => String, { nullable: true })
  googleId?: string;

  @Field(() => String, { nullable: true })
  telegramId?: string;

  @Field(() => String)
  memberNick: string;

  @Field(() => String, { nullable: true })
  memberDesc?: string;

  @Field(() => String, { nullable: true })
  memberImage?: string;

  @Field(() => String, { nullable: true })
  memberAddress?: string;

  @Field(() => Int)
  memberAntiques: number;

  @Field(() => Int)
  memberRank: number;

  @Field(() => Int)
  memberPoints: number;

  @Field(() => Int)
  memberFollowers: number;

  @Field(() => Int)
  memberFollowings: number;

  @Field(() => Int)
  memberViews: number;

  @Field(() => Int)
  memberLikes: number;

  @Field(() => Int)
  memberComments: number;

  @Field(() => Int)
  memberWarnings: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}

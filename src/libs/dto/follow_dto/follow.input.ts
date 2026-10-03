import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';

@InputType()
export class FollowInput {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  followingId: ObjectId;

  // Set from the authenticated member, never from the client
  followerId?: ObjectId;
}

@InputType()
class FISearch {
  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  followingId?: ObjectId;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  followerId?: ObjectId;
}

@InputType()
export class FollowInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Field(() => Int)
  limit: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FISearch)
  @Field(() => FISearch)
  search: FISearch;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';

@InputType()
export class LikeInput {
  @IsNotEmpty()
  @IsEnum(LikeGroup)
  @Field(() => LikeGroup)
  likeGroup: LikeGroup;

  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  likeRefId: ObjectId;

  // Set from the authenticated member
  memberId?: ObjectId;
}

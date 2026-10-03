import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';
import { availableCommentSorts } from '../../config';

@InputType()
export class CommentInput {
  @IsNotEmpty()
  @IsEnum(CommentGroup)
  @Field(() => CommentGroup)
  commentGroup: CommentGroup;

  @IsNotEmpty()
  @Length(1, 1000)
  @Field(() => String)
  commentContent: string;

  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  commentRefId: ObjectId;

  // Set from the authenticated member
  memberId?: ObjectId;
}

@InputType()
class CISearch {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  commentRefId: ObjectId;
}

@InputType()
export class CommentsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableCommentSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CISearch)
  @Field(() => CISearch)
  search: CISearch;
}

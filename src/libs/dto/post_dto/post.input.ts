import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import { PostCategory } from '../../enums/post.enum';
import { Direction } from '../../enums/common.enum';
import { availablePostSorts } from '../../config';

@InputType()
export class PostInput {
  @IsNotEmpty()
  @IsEnum(PostCategory)
  @Field(() => PostCategory)
  postCategory: PostCategory;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  postImages?: string[];

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  postTitle: string;

  @IsNotEmpty()
  @Length(3, 10000)
  @Field(() => String)
  postContent: string;

  // Set from the authenticated member
  memberId?: ObjectId;
}

@InputType()
class PISearch {
  @IsOptional()
  @IsEnum(PostCategory)
  @Field(() => PostCategory, { nullable: true })
  postCategory?: PostCategory;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class PostsInquiry {
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
  @IsIn(availablePostSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PISearch)
  @Field(() => PISearch)
  search: PISearch;
}

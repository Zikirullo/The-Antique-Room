import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import { PostCategory, PostStatus } from '../../enums/post.enum';

@InputType()
export class PostUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsEnum(PostCategory)
  @Field(() => PostCategory, { nullable: true })
  postCategory?: PostCategory;

  @IsOptional()
  @IsEnum(PostStatus)
  @Field(() => PostStatus, { nullable: true })
  postStatus?: PostStatus;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  postImages?: string[];

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  postTitle?: string;

  @IsOptional()
  @Length(3, 10000)
  @Field(() => String, { nullable: true })
  postContent?: string;

  deletedAt?: Date;
}

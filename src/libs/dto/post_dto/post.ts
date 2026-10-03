import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { PostCategory, PostStatus } from '../../enums/post.enum';

@ObjectType()
export class Post {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => PostCategory)
  postCategory: PostCategory;

  @Field(() => PostStatus)
  postStatus: PostStatus;

  @Field(() => [String])
  postImages: string[];

  @Field(() => String)
  postTitle: string;

  @Field(() => String)
  postContent: string;

  @Field(() => Int)
  postLikes: number;

  @Field(() => Int)
  postViews: number;

  @Field(() => Int)
  postComments: number;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

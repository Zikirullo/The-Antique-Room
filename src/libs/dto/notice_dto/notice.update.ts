import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@InputType()
export class NoticeUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsEnum(NoticeCategory)
  @Field(() => NoticeCategory, { nullable: true })
  noticeCategory?: NoticeCategory;

  @IsOptional()
  @IsEnum(NoticeStatus)
  @Field(() => NoticeStatus, { nullable: true })
  noticeStatus?: NoticeStatus;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  noticeTitle?: string;

  @IsOptional()
  @Length(3, 5000)
  @Field(() => String, { nullable: true })
  noticeContent?: string;
}

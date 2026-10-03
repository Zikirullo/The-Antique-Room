import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';
import { availableNoticeSorts } from '../../config';

@InputType()
export class NoticeInput {
  @IsNotEmpty()
  @IsEnum(NoticeCategory)
  @Field(() => NoticeCategory)
  noticeCategory: NoticeCategory;

  @IsOptional()
  @IsEnum(NoticeStatus)
  @Field(() => NoticeStatus, { nullable: true })
  noticeStatus?: NoticeStatus;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  noticeTitle: string;

  @IsNotEmpty()
  @Length(3, 5000)
  @Field(() => String)
  noticeContent: string;

  // Set from the authenticated admin
  adminId?: ObjectId;
}

@InputType()
class NISearch {
  @IsOptional()
  @IsEnum(NoticeCategory)
  @Field(() => NoticeCategory, { nullable: true })
  noticeCategory?: NoticeCategory;

  @IsOptional()
  @IsEnum(NoticeStatus)
  @Field(() => NoticeStatus, { nullable: true })
  noticeStatus?: NoticeStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class NoticesInquiry {
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
  @IsIn(availableNoticeSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NISearch)
  @Field(() => NISearch)
  search: NISearch;
}

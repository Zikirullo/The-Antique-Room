import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import {
  NotificationGroup,
  NotificationStatus,
  NotificationType,
} from '../../enums/notification.enum';

// Created by the backend (e.g. on like / comment / follow), not by clients
export class NotificationInput {
  notificationType: NotificationType;
  notificationGroup: NotificationGroup;
  notificationTitle: string;
  notificationDesc?: string;
  authorId?: ObjectId;
  receiverId: ObjectId;
  antiqueId?: ObjectId;
  postId?: ObjectId;
  commentId?: ObjectId;
  reportId?: ObjectId;
}

@InputType()
class NTSearch {
  @IsOptional()
  @IsEnum(NotificationStatus)
  @Field(() => NotificationStatus, { nullable: true })
  notificationStatus?: NotificationStatus;

  @IsOptional()
  @IsEnum(NotificationGroup)
  @Field(() => NotificationGroup, { nullable: true })
  notificationGroup?: NotificationGroup;
}

@InputType()
export class NotificationsInquiry {
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
  @Type(() => NTSearch)
  @Field(() => NTSearch)
  search: NTSearch;
}

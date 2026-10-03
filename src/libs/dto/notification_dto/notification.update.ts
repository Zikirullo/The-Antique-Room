import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { NotificationStatus } from '../../enums/notification.enum';

@InputType()
export class NotificationUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsNotEmpty()
  @IsEnum(NotificationStatus)
  @Field(() => NotificationStatus)
  notificationStatus: NotificationStatus;
}

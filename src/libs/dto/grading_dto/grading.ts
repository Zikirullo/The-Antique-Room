import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { AntiqueGrade, GradingStatus } from '../../enums/grading.enum';

@ObjectType()
export class GradingRequest {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  antiqueId: ObjectId;

  @Field(() => String)
  sellerId: ObjectId;

  @Field(() => String, { nullable: true })
  expertId?: ObjectId;

  @Field(() => GradingStatus)
  gradingStatus: GradingStatus;

  @Field(() => AntiqueGrade, { nullable: true })
  grade?: AntiqueGrade;

  @Field(() => String, { nullable: true })
  expertNotes?: string;

  @Field(() => String, { nullable: true })
  rejectionReason?: string;

  @Field(() => String, { nullable: true })
  certificateNumber?: string;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

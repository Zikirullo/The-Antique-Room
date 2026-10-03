import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateIf,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import { AntiqueGrade, GradingStatus } from '../../enums/grading.enum';

// Admin assigns an expert / expert submits the result
@InputType()
export class GradingRequestUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  expertId?: ObjectId;

  @IsOptional()
  @IsEnum(GradingStatus)
  @Field(() => GradingStatus, { nullable: true })
  gradingStatus?: GradingStatus;

  // A completed grading must have a grade
  @ValidateIf((o) => o.gradingStatus === GradingStatus.COMPLETED)
  @IsNotEmpty()
  @IsEnum(AntiqueGrade)
  @Field(() => AntiqueGrade, { nullable: true })
  grade?: AntiqueGrade;

  @IsOptional()
  @Length(0, 3000)
  @Field(() => String, { nullable: true })
  expertNotes?: string;

  // A rejected grading must have a reason
  @ValidateIf((o) => o.gradingStatus === GradingStatus.REJECTED)
  @IsNotEmpty()
  @Length(3, 1000)
  @Field(() => String, { nullable: true })
  rejectionReason?: string;

  // Set by the service
  certificateNumber?: string;
  completedAt?: Date;
}

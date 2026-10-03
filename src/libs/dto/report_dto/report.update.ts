import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import { ReportAction, ReportStatus } from '../../enums/report.enum';

// Admin-only: reviewing / resolving a report
@InputType()
export class ReportUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsEnum(ReportStatus)
  @Field(() => ReportStatus, { nullable: true })
  reportStatus?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportAction)
  @Field(() => ReportAction, { nullable: true })
  reportAction?: ReportAction;

  @IsOptional()
  @Length(0, 1000)
  @Field(() => String, { nullable: true })
  messageToReportedMember?: string;

  @IsOptional()
  @Length(0, 1000)
  @Field(() => String, { nullable: true })
  adminNote?: string;

  // Set by the service
  adminId?: ObjectId;
  resolvedAt?: Date;
}

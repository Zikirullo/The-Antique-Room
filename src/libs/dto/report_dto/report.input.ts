import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import {
  ReportGroup,
  ReportReason,
  ReportStatus,
} from '../../enums/report.enum';
import { Direction } from '../../enums/common.enum';
import { availableReportSorts } from '../../config';

@InputType()
export class ReportInput {
  @IsNotEmpty()
  @IsEnum(ReportGroup)
  @Field(() => ReportGroup)
  reportGroup: ReportGroup;

  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  reportRefId: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  reportedMemberId: ObjectId;

  @IsNotEmpty()
  @IsEnum(ReportReason)
  @Field(() => ReportReason)
  reportReason: ReportReason;

  @IsOptional()
  @Length(0, 1000)
  @Field(() => String, { nullable: true })
  reportDescription?: string;

  // Set from the authenticated member
  reporterId?: ObjectId;
}

@InputType()
class RISearch {
  @IsOptional()
  @IsEnum(ReportStatus)
  @Field(() => ReportStatus, { nullable: true })
  reportStatus?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportGroup)
  @Field(() => ReportGroup, { nullable: true })
  reportGroup?: ReportGroup;

  @IsOptional()
  @IsEnum(ReportReason)
  @Field(() => ReportReason, { nullable: true })
  reportReason?: ReportReason;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  reportedMemberId?: ObjectId;
}

@InputType()
export class ReportsInquiry {
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
  @IsIn(availableReportSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RISearch)
  @Field(() => RISearch)
  search: RISearch;
}

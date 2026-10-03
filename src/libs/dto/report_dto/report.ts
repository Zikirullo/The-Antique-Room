import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
  ReportAction,
  ReportGroup,
  ReportReason,
  ReportStatus,
} from '../../enums/report.enum';

@ObjectType()
export class Report {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String, { nullable: true })
  adminId?: ObjectId;

  @Field(() => String)
  reporterId: ObjectId;

  @Field(() => String)
  reportedMemberId: ObjectId;

  @Field(() => String)
  reportRefId: ObjectId;

  @Field(() => ReportStatus)
  reportStatus: ReportStatus;

  @Field(() => ReportReason)
  reportReason: ReportReason;

  @Field(() => ReportGroup)
  reportGroup: ReportGroup;

  @Field(() => ReportAction, { nullable: true })
  reportAction?: ReportAction;

  @Field(() => String, { nullable: true })
  messageToReportedMember?: string;

  @Field(() => String, { nullable: true })
  reportDescription?: string;

  // Internal admin note: only expose to admins in the resolver
  @Field(() => String, { nullable: true })
  adminNote?: string;

  @Field(() => Date, { nullable: true })
  resolvedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

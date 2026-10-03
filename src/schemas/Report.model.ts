import { Schema } from 'mongoose';
import {
  ReportAction,
  ReportGroup,
  ReportReason,
  ReportStatus,
} from '../libs/enums/report.enum';

const ReportSchema = new Schema(
  {
    // Set when an admin picks up the report
    adminId: { type: Schema.Types.ObjectId, ref: 'Member' },
    reporterId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    reportedMemberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    reportRefId: { type: Schema.Types.ObjectId, required: true },

    reportStatus: {
      type: String,
      enum: ReportStatus,
      default: ReportStatus.PENDING,
    },
    reportReason: { type: String, enum: ReportReason, required: true },
    reportGroup: { type: String, enum: ReportGroup, required: true },
    reportAction: { type: String, enum: ReportAction },

    messageToReportedMember: { type: String },
    reportDescription: { type: String },
    adminNote: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true, collection: 'reports' },
);

// A member can report the same target only once
ReportSchema.index({ reporterId: 1, reportRefId: 1 }, { unique: true });
ReportSchema.index({ reportStatus: 1, createdAt: -1 });

export default ReportSchema;

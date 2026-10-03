import { registerEnumType } from '@nestjs/graphql';

export enum ReportStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}
registerEnumType(ReportStatus, { name: 'ReportStatus' });

export enum ReportReason {
  SPAM = 'SPAM',
  SCAM_FRAUD = 'SCAM_FRAUD',
  COUNTERFEIT_ITEM = 'COUNTERFEIT_ITEM',
  MISLEADING_DESCRIPTION = 'MISLEADING_DESCRIPTION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  HARASSMENT = 'HARASSMENT',
  OTHER = 'OTHER',
}
registerEnumType(ReportReason, { name: 'ReportReason' });

export enum ReportGroup {
  MEMBER = 'MEMBER',
  ANTIQUE = 'ANTIQUE',
  POST = 'POST',
  COMMENT = 'COMMENT',
}
registerEnumType(ReportGroup, { name: 'ReportGroup' });

export enum ReportAction {
  NO_ACTION = 'NO_ACTION',
  WARNING = 'WARNING',
  CONTENT_REMOVED = 'CONTENT_REMOVED',
  MEMBER_SUSPENDED = 'MEMBER_SUSPENDED',
  MEMBER_BLOCKED = 'MEMBER_BLOCKED',
}
registerEnumType(ReportAction, { name: 'ReportAction' });

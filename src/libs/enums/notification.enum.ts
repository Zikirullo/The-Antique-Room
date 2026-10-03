import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  PURCHASE = 'PURCHASE',
  GRADING = 'GRADING',
  REPORT = 'REPORT',
  NOTICE = 'NOTICE',
}
registerEnumType(NotificationType, { name: 'NotificationType' });

export enum NotificationStatus {
  WAIT = 'WAIT',
  READ = 'READ',
}
registerEnumType(NotificationStatus, { name: 'NotificationStatus' });

export enum NotificationGroup {
  MEMBER = 'MEMBER',
  ANTIQUE = 'ANTIQUE',
  POST = 'POST',
  COMMENT = 'COMMENT',
  REPORT = 'REPORT',
  SYSTEM = 'SYSTEM',
}
registerEnumType(NotificationGroup, { name: 'NotificationGroup' });

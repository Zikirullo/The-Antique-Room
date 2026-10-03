import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  EVENT = 'EVENT',
  UPDATE = 'UPDATE',
  TERMS = 'TERMS',
}
registerEnumType(NoticeCategory, { name: 'NoticeCategory' });

export enum NoticeStatus {
  HOLD = 'HOLD',
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
}
registerEnumType(NoticeStatus, { name: 'NoticeStatus' });

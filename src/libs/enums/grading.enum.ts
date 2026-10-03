import { registerEnumType } from '@nestjs/graphql';

export enum GradingStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}
registerEnumType(GradingStatus, { name: 'GradingStatus' });

export enum AntiqueGrade {
  AUTHENTIC = 'AUTHENTIC',
  LIKELY_AUTHENTIC = 'LIKELY_AUTHENTIC',
  INCONCLUSIVE = 'INCONCLUSIVE',
  REPRODUCTION = 'REPRODUCTION',
  COUNTERFEIT = 'COUNTERFEIT',
}
registerEnumType(AntiqueGrade, { name: 'AntiqueGrade' });

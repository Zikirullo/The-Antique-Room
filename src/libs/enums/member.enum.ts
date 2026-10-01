import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
  COLLECTOR = 'COLLECTOR',
  SELLER = 'SELLER',
  GRADING_EXPERT = 'GRADING_EXPERT',
  ADMIN = 'ADMIN',
}

registerEnumType(MemberType, {
  name: 'MemberType',
});

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
}

registerEnumType(MemberStatus, {
  name: 'MemberStatus',
});

export enum MemberAuth {
  PHONE = 'PHONE',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  TELEGRAM = 'TELEGRAM',
}

registerEnumType(MemberAuth, {
  name: 'MemberAuth',
});

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(VerificationStatus, {
  name: 'VerificationStatus',
});

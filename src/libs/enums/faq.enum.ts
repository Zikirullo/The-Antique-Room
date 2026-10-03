import { registerEnumType } from '@nestjs/graphql';

export enum FaqCategory {
  ACCOUNT = 'ACCOUNT',
  BUYING = 'BUYING',
  SELLING = 'SELLING',
  GRADING = 'GRADING',
  PAYMENT = 'PAYMENT',
  SHIPPING = 'SHIPPING',
  OTHER = 'OTHER',
}
registerEnumType(FaqCategory, { name: 'FaqCategory' });

export enum FaqStatus {
  HOLD = 'HOLD',
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
}
registerEnumType(FaqStatus, { name: 'FaqStatus' });

import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
  MEMBER = 'MEMBER',
  ANTIQUE = 'ANTIQUE',
  POST = 'POST',
}
registerEnumType(ViewGroup, { name: 'ViewGroup' });

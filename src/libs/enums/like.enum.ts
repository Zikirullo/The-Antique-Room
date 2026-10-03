import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
  MEMBER = 'MEMBER',
  ANTIQUE = 'ANTIQUE',
  POST = 'POST',
}
registerEnumType(LikeGroup, { name: 'LikeGroup' });

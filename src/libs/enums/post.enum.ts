import { registerEnumType } from '@nestjs/graphql';

export enum PostCategory {
  DISCUSSION = 'DISCUSSION',
  SHOWCASE = 'SHOWCASE',
  COLLECTING_TIPS = 'COLLECTING_TIPS',
  RESTORATION = 'RESTORATION',
  MARKET_NEWS = 'MARKET_NEWS',
  QUESTION = 'QUESTION',
}
registerEnumType(PostCategory, { name: 'PostCategory' });

export enum PostStatus {
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
}
registerEnumType(PostStatus, { name: 'PostStatus' });

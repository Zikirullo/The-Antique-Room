import { ObjectId } from 'bson';

export const availableMemberSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
  'memberRank',
];
export const availableExpertSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
  'memberRank',
  'yearsOfExperience',
];

export const availableAntiqueSorts = [
  'createdAt',
  'updatedAt',
  'antiquePrice',
  'antiqueViews',
  'antiqueLikes',
  'antiqueComments',
  'reviewRating',
];

export const availablePostSorts = [
  'createdAt',
  'updatedAt',
  'postLikes',
  'postViews',
  'postComments',
];

export const availableCommentSorts = ['createdAt', 'updatedAt'];

export const availableNoticeSorts = ['createdAt', 'updatedAt', 'noticeTitle'];

export const availableReportSorts = ['createdAt', 'updatedAt', 'resolvedAt'];

export const availableGradingSorts = ['createdAt', 'updatedAt', 'completedAt'];

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};

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

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};

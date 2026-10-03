import { ObjectId } from 'bson';
import type { T } from './types/common';

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

/** AGGREGATION HELPERS **/

// Adds `meLiked` ([{ memberId, likeRefId, myFavorite: true }] or []) for the current member
export const lookupAuthMemberLiked = (
  memberId: T | null,
  targetRefId: string = '$_id',
) => {
  return {
    $lookup: {
      from: 'likes',
      let: {
        localLikeRefId: targetRefId,
        localMemberId: memberId,
        localMyFavorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$likeRefId', '$$localLikeRefId'] },
                { $eq: ['$memberId', '$$localMemberId'] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            memberId: 1,
            likeRefId: 1,
            myFavorite: '$$localMyFavorite',
          },
        },
      ],
      as: 'meLiked',
    },
  };
};

// Adds `memberData` (the owner) without the password hash
export const lookupMember = {
  $lookup: {
    from: 'members',
    localField: 'memberId',
    foreignField: '_id',
    pipeline: [{ $project: { memberPassword: 0 } }],
    as: 'memberData',
  },
};

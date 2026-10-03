import { Schema } from 'mongoose';
import { LikeGroup } from '../libs/enums/like.enum';

const LikeSchema = new Schema(
  {
    likeGroup: { type: String, enum: LikeGroup, required: true },
    likeRefId: { type: Schema.Types.ObjectId, required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  },
  { timestamps: true, collection: 'likes' },
);

// One like per member per target
LikeSchema.index({ memberId: 1, likeRefId: 1 }, { unique: true });

export default LikeSchema;

import { Schema } from 'mongoose';

const FollowSchema = new Schema(
  {
    followingId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    followerId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  },
  { timestamps: true, collection: 'follows' },
);

// A member can follow another member only once
FollowSchema.index({ followingId: 1, followerId: 1 }, { unique: true });

export default FollowSchema;

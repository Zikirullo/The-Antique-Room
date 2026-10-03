import { Schema } from 'mongoose';
import { PostCategory, PostStatus } from '../libs/enums/post.enum';

const PostSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    postCategory: { type: String, enum: PostCategory, required: true },
    postStatus: { type: String, enum: PostStatus, default: PostStatus.ACTIVE },
    postImages: { type: [String], default: [] },
    postTitle: { type: String, required: true },
    postContent: { type: String, required: true },
    postLikes: { type: Number, default: 0 },
    postViews: { type: Number, default: 0 },
    postComments: { type: Number, default: 0 },
    deletedAt: { type: Date },
  },
  { timestamps: true, collection: 'posts' },
);

export default PostSchema;

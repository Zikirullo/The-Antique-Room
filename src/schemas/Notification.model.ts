import { Schema } from 'mongoose';
import {
  NotificationGroup,
  NotificationStatus,
  NotificationType,
} from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
  {
    notificationType: { type: String, enum: NotificationType, required: true },
    notificationStatus: {
      type: String,
      enum: NotificationStatus,
      default: NotificationStatus.WAIT,
    },
    notificationGroup: {
      type: String,
      enum: NotificationGroup,
      required: true,
    },
    notificationTitle: { type: String, required: true },
    notificationDesc: { type: String },

    // Who triggered it (empty for system notifications) and who receives it
    authorId: { type: Schema.Types.ObjectId, ref: 'Member' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },

    // What it is about (whichever applies)
    antiqueId: { type: Schema.Types.ObjectId, ref: 'Antique' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
  },
  { timestamps: true, collection: 'notifications' },
);

NotificationSchema.index({
  receiverId: 1,
  notificationStatus: 1,
  createdAt: -1,
});

export default NotificationSchema;

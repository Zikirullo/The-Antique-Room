import { Schema } from 'mongoose';
import { AntiqueGrade, GradingStatus } from '../libs/enums/grading.enum';

const GradingRequestSchema = new Schema(
  {
    antiqueId: { type: Schema.Types.ObjectId, ref: 'Antique', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    // Assigned grading expert
    expertId: { type: Schema.Types.ObjectId, ref: 'Member' },

    gradingStatus: {
      type: String,
      enum: GradingStatus,
      default: GradingStatus.PENDING,
    },
    grade: { type: String, enum: AntiqueGrade },
    expertNotes: { type: String },
    rejectionReason: { type: String },
    certificateNumber: { type: String, unique: true, sparse: true },
    completedAt: { type: Date },
  },
  { timestamps: true, collection: 'gradingRequests' },
);

GradingRequestSchema.index({ expertId: 1, gradingStatus: 1 });
GradingRequestSchema.index({ antiqueId: 1 });

export default GradingRequestSchema;

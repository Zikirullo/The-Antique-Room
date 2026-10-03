import { Schema } from 'mongoose';
import { FaqCategory, FaqStatus } from '../libs/enums/faq.enum';

const FaqSchema = new Schema(
  {
    faqCategory: { type: String, enum: FaqCategory, required: true },
    faqQuestion: { type: String, required: true },
    faqAnswer: { type: String, required: true },
    faqStatus: { type: String, enum: FaqStatus, default: FaqStatus.ACTIVE },
  },
  { timestamps: true, collection: 'faqs' },
);

export default FaqSchema;

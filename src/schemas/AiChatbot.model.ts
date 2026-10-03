import { Schema } from 'mongoose';
import { MessageRole } from '../libs/enums/chatbot.enum';

const MessageSchema = new Schema(
  {
    role: { type: String, enum: MessageRole, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const AiChatbotSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    title: { type: String, required: true, default: 'New chat' },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true, collection: 'aiChatbots' },
);

AiChatbotSchema.index({ memberId: 1, updatedAt: -1 });

export default AiChatbotSchema;

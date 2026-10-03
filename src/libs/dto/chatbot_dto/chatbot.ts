import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { MessageRole } from '../../enums/chatbot.enum';

@ObjectType()
export class ChatMessage {
  @Field(() => MessageRole)
  role: MessageRole;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class AiChatbot {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String)
  title: string;

  @Field(() => [ChatMessage])
  messages: ChatMessage[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

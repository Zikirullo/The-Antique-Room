import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';
import type { ObjectId } from 'mongoose';

// Send a message; omit chatId to start a new chat
@InputType()
export class ChatMessageInput {
  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  chatId?: ObjectId;

  @IsNotEmpty()
  @Length(1, 2000)
  @Field(() => String)
  content: string;

  // Set from the authenticated member
  memberId?: ObjectId;
}

@InputType()
export class AiChatbotsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Field(() => Int)
  limit: number;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, Length } from 'class-validator';
import type { ObjectId } from 'mongoose';

// Rename a chat
@InputType()
export class AiChatbotUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsNotEmpty()
  @Length(1, 100)
  @Field(() => String)
  title: string;
}

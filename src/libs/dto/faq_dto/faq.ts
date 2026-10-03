import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

@ObjectType()
export class Faq {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => FaqCategory)
  faqCategory: FaqCategory;

  @Field(() => String)
  faqQuestion: string;

  @Field(() => String)
  faqAnswer: string;

  @Field(() => FaqStatus)
  faqStatus: FaqStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

@InputType()
export class FaqUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsEnum(FaqCategory)
  @Field(() => FaqCategory, { nullable: true })
  faqCategory?: FaqCategory;

  @IsOptional()
  @Length(3, 300)
  @Field(() => String, { nullable: true })
  faqQuestion?: string;

  @IsOptional()
  @Length(3, 5000)
  @Field(() => String, { nullable: true })
  faqAnswer?: string;

  @IsOptional()
  @IsEnum(FaqStatus)
  @Field(() => FaqStatus, { nullable: true })
  faqStatus?: FaqStatus;
}

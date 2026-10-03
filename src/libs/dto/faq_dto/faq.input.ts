import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

@InputType()
export class FaqInput {
  @IsNotEmpty()
  @IsEnum(FaqCategory)
  @Field(() => FaqCategory)
  faqCategory: FaqCategory;

  @IsNotEmpty()
  @Length(3, 300)
  @Field(() => String)
  faqQuestion: string;

  @IsNotEmpty()
  @Length(3, 5000)
  @Field(() => String)
  faqAnswer: string;

  @IsOptional()
  @IsEnum(FaqStatus)
  @Field(() => FaqStatus, { nullable: true })
  faqStatus?: FaqStatus;
}

@InputType()
class FQSearch {
  @IsOptional()
  @IsEnum(FaqCategory)
  @Field(() => FaqCategory, { nullable: true })
  faqCategory?: FaqCategory;

  @IsOptional()
  @IsEnum(FaqStatus)
  @Field(() => FaqStatus, { nullable: true })
  faqStatus?: FaqStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class FaqsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Field(() => Int)
  limit: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FQSearch)
  @Field(() => FQSearch)
  search: FQSearch;
}

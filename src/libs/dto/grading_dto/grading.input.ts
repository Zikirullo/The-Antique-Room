import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import { GradingStatus } from '../../enums/grading.enum';
import { Direction } from '../../enums/common.enum';
import { availableGradingSorts } from '../../config';

// Seller asks for their antique to be graded
@InputType()
export class GradingRequestInput {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  antiqueId: ObjectId;

  // Set from the authenticated member
  sellerId?: ObjectId;
}

@InputType()
class GRSearch {
  @IsOptional()
  @IsEnum(GradingStatus)
  @Field(() => GradingStatus, { nullable: true })
  gradingStatus?: GradingStatus;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  expertId?: ObjectId;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  sellerId?: ObjectId;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  antiqueId?: ObjectId;
}

@InputType()
export class GradingRequestsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableGradingSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GRSearch)
  @Field(() => GRSearch)
  search: GRSearch;
}

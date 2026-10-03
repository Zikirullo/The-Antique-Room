import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { ViewGroup } from '../../enums/view.enum';

@InputType()
export class ViewInput {
  @IsNotEmpty()
  @IsEnum(ViewGroup)
  @Field(() => ViewGroup)
  viewGroup: ViewGroup;

  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  viewRefId: ObjectId;

  // Set from the authenticated member
  memberId?: ObjectId;
}

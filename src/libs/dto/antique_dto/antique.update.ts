import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { AntiqueCondition, AntiqueStatus } from '../../enums/antique.enum';
import {
  ArtDetailsInput,
  BooksMapsDocumentsDetailsInput,
  CeramicsPorcelainDetailsInput,
  ClocksTimepiecesDetailsInput,
  CoinsCurrenciesStampsDetailsInput,
  FurnitureDetailsInput,
  JewellerySilverwareDetailsInput,
} from './antique.input';

@InputType()
export class AntiqueUpdate {
  @IsNotEmpty() @Field(() => String) _id: ObjectId;

  @IsOptional()
  @Field(() => AntiqueStatus, { nullable: true })
  antiqueStatus?: AntiqueStatus;
  @IsOptional() @Field(() => String, { nullable: true }) buyerId?: ObjectId;
  @IsOptional() @Field(() => Int, { nullable: true }) reviewRating?: number;
  reviewedAt?: Date;
  soldAt?: Date;
  deletedAt?: Date;

  // Seller-editable
  @IsOptional()
  @Field(() => AntiqueCondition, { nullable: true })
  antiqueCondition?: AntiqueCondition;
  @IsOptional() @Field(() => Int, { nullable: true }) antiquePrice?: number;
  @IsOptional() @Field(() => String, { nullable: true }) antiqueDesc?: string;
  @IsOptional()
  @Field(() => [String], { nullable: true })
  antiqueImages?: string[];

  @IsOptional()
  @Field(() => FurnitureDetailsInput, { nullable: true })
  furnitureDetails?: FurnitureDetailsInput;
  @IsOptional()
  @Field(() => ArtDetailsInput, { nullable: true })
  artDetails?: ArtDetailsInput;
  @IsOptional()
  @Field(() => CeramicsPorcelainDetailsInput, { nullable: true })
  ceramicsPorcelainDetails?: CeramicsPorcelainDetailsInput;
  @IsOptional()
  @Field(() => JewellerySilverwareDetailsInput, { nullable: true })
  jewellerySilverwareDetails?: JewellerySilverwareDetailsInput;
  @IsOptional()
  @Field(() => BooksMapsDocumentsDetailsInput, { nullable: true })
  booksMapsDocumentsDetails?: BooksMapsDocumentsDetailsInput;
  @IsOptional()
  @Field(() => ClocksTimepiecesDetailsInput, { nullable: true })
  clocksTimepiecesDetails?: ClocksTimepiecesDetailsInput;
  @IsOptional()
  @Field(() => CoinsCurrenciesStampsDetailsInput, { nullable: true })
  coinsCurrenciesStampsDetails?: CoinsCurrenciesStampsDetailsInput;
}

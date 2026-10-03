import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
  AntiqueStatus,
  AntiqueCategory,
  AntiqueCondition,
  ArtMedium,
  MetalType,
  BookEdition,
  ClockMovementType,
  ClockWorkingStatus,
} from '../../enums/antique.enum';
import { Member } from '../member_dto/member';
import { MeLiked } from '../like_dto/like';
import { TotalCounter } from '../common';

@ObjectType()
export class FurnitureDetails {
  @Field(() => String)
  furnitureStylePeriod: string;

  @Field(() => String)
  woodType: string;

  @Field(() => String)
  furnitureDimensions: string;

  @Field(() => String, { nullable: true })
  furnitureMaker?: string;
}

@ObjectType()
export class ArtDetails {
  @Field(() => String)
  artistName: string;

  @Field(() => ArtMedium)
  artMedium: ArtMedium;

  @Field(() => Boolean)
  artSigned: boolean;

  @Field(() => String, { nullable: true })
  artNote?: string;
}

@ObjectType()
export class CeramicsPorcelainDetails {
  @Field(() => String)
  maker: string;

  @Field(() => String)
  trademark: string;

  @Field(() => String)
  pattern: string;
}

@ObjectType()
export class JewellerySilverwareDetails {
  @Field(() => MetalType)
  metalType: MetalType;

  @Field(() => String)
  trademark: string;

  @Field(() => String, { nullable: true })
  gemstones?: string;
}

@ObjectType()
export class BooksMapsDocumentsDetails {
  @Field(() => BookEdition) edition: BookEdition;
  @Field(() => String, { nullable: true })
  publisher?: string;

  @Field(() => String, { nullable: true })
  condition?: string;

  @Field(() => String, { nullable: true })
  yearPrinted?: string;
}

@ObjectType()
export class ClocksTimepiecesDetails {
  @Field(() => ClockMovementType)
  movementType: ClockMovementType;

  @Field(() => ClockWorkingStatus)
  workingStatus: ClockWorkingStatus;

  @Field(() => String)
  maker: string;
}

@ObjectType()
export class CoinsCurrenciesStampsDetails {
  @Field(() => String)
  denomination: string;

  @Field(() => String)
  printYear: string;

  @Field(() => String)
  countryOfOrigin: string;
}

@ObjectType()
export class Antique {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String, { nullable: true })
  buyerId?: ObjectId;

  @Field(() => AntiqueStatus)
  antiqueStatus: AntiqueStatus;

  @Field(() => AntiqueCategory)
  antiqueCategory: AntiqueCategory;

  @Field(() => AntiqueCondition)
  antiqueCondition: AntiqueCondition;

  @Field(() => [String])
  antiqueImages: string[];

  @Field(() => Boolean)
  antiqueDeclaration: boolean;

  @Field(() => String)
  antiqueEra: string;

  @Field(() => String)
  antiqueOrigin: string;

  @Field(() => String, { nullable: true })
  antiqueDesc?: string;

  @Field(() => FurnitureDetails, { nullable: true })
  furnitureDetails?: FurnitureDetails;

  @Field(() => ArtDetails, { nullable: true }) artDetails?: ArtDetails;

  @Field(() => CeramicsPorcelainDetails, { nullable: true })
  ceramicsPorcelainDetails?: CeramicsPorcelainDetails;

  @Field(() => JewellerySilverwareDetails, { nullable: true })
  jewellerySilverwareDetails?: JewellerySilverwareDetails;

  @Field(() => BooksMapsDocumentsDetails, { nullable: true })
  booksMapsDocumentsDetails?: BooksMapsDocumentsDetails;

  @Field(() => ClocksTimepiecesDetails, { nullable: true })
  clocksTimepiecesDetails?: ClocksTimepiecesDetails;

  @Field(() => CoinsCurrenciesStampsDetails, { nullable: true })
  coinsCurrenciesStampsDetails?: CoinsCurrenciesStampsDetails;

  @Field(() => Int)
  antiquePrice: number;

  @Field(() => Int)
  antiqueViews: number;

  @Field(() => Int)
  antiqueLikes: number;

  @Field(() => Int)
  antiqueComments: number;

  @Field(() => Int, { nullable: true })
  reviewRating?: number;

  @Field(() => Date, { nullable: true })
  reviewedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date, { nullable: true })
  soldAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /** from aggregation **/

  @Field(() => [MeLiked], { nullable: true })
  meLiked?: MeLiked[];

  @Field(() => Member, { nullable: true })
  memberData?: Member;
}

@ObjectType()
export class Antiques {
  @Field(() => [Antique])
  list: Antique[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

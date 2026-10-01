import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AntiqueCategory,
  AntiqueCondition,
  ArtMedium,
  BookEdition,
  ClockMovementType,
  ClockWorkingStatus,
  MetalType,
} from '../../enums/antique.enum';
import { availableAntiqueSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class FurnitureDetailsInput {
  @IsNotEmpty() @IsString() @Field(() => String) furnitureStylePeriod: string;
  @IsNotEmpty() @Field(() => String) woodType: string;
  @IsNotEmpty() @Field(() => String) furnitureDimensions: string;
  @IsOptional()
  @Field(() => String, { nullable: true })
  furnitureMaker?: string;
}

@InputType()
export class ArtDetailsInput {
  @IsNotEmpty() @Field(() => String) artistName: string;
  @IsEnum(ArtMedium) @Field(() => ArtMedium) artMedium: ArtMedium;
  @IsBoolean() @Field(() => Boolean) artSigned: boolean;
  @IsOptional() @Field(() => String, { nullable: true }) artNote?: string;
}

@InputType()
export class CeramicsPorcelainDetailsInput {
  @IsNotEmpty() @Field(() => String) maker: string;
  @IsNotEmpty() @Field(() => String) trademark: string;
  @IsNotEmpty() @Field(() => String) pattern: string;
}

@InputType()
export class JewellerySilverwareDetailsInput {
  @IsEnum(MetalType) @Field(() => MetalType) metalType: MetalType;
  @IsNotEmpty() @Field(() => String) trademark: string;
  @IsOptional() @Field(() => String, { nullable: true }) gemstones?: string;
}

@InputType()
export class BooksMapsDocumentsDetailsInput {
  @IsEnum(BookEdition) @Field(() => BookEdition) edition: BookEdition;
  @IsOptional() @Field(() => String, { nullable: true }) publisher?: string;
  @IsOptional() @Field(() => String, { nullable: true }) condition?: string;
  @IsOptional() @Field(() => String, { nullable: true }) yearPrinted?: string;
}

@InputType()
export class ClocksTimepiecesDetailsInput {
  @IsEnum(ClockMovementType)
  @Field(() => ClockMovementType)
  movementType: ClockMovementType;
  @IsEnum(ClockWorkingStatus)
  @Field(() => ClockWorkingStatus)
  workingStatus: ClockWorkingStatus;
  @IsNotEmpty() @Field(() => String) maker: string;
}

@InputType()
export class CoinsCurrenciesStampsDetailsInput {
  @IsNotEmpty() @Field(() => String) denomination: string;
  @IsNotEmpty() @Field(() => String) printYear: string;
  @IsNotEmpty() @Field(() => String) countryOfOrigin: string;
}

@InputType()
export class AntiqueInput {
  @IsEnum(AntiqueCategory)
  @Field(() => AntiqueCategory)
  antiqueCategory: AntiqueCategory;
  @IsEnum(AntiqueCondition)
  @Field(() => AntiqueCondition)
  antiqueCondition: AntiqueCondition;

  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  antiqueImages: string[];

  @IsNotEmpty({ message: 'You must confirm ownership to list an item' })
  @IsBoolean()
  @Field(() => Boolean)
  antiqueDeclaration: boolean;

  @IsNotEmpty() @Field(() => String) antiqueEra: string;
  @IsNotEmpty() @Field(() => String) antiqueOrigin: string;
  @IsOptional() @Field(() => String, { nullable: true }) antiqueDesc?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Int)
  antiquePrice: number;

  @ValidateIf((o) => o.antiqueCategory === AntiqueCategory.FURNITURE)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FurnitureDetailsInput)
  @Field(() => FurnitureDetailsInput, { nullable: true })
  furnitureDetails?: FurnitureDetailsInput;

  @ValidateIf((o) => o.antiqueCategory === AntiqueCategory.ART)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ArtDetailsInput)
  @Field(() => ArtDetailsInput, { nullable: true })
  artDetails?: ArtDetailsInput;

  @ValidateIf((o) => o.antiqueCategory === AntiqueCategory.CERAMICS_PORCELAIN)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CeramicsPorcelainDetailsInput)
  @Field(() => CeramicsPorcelainDetailsInput, { nullable: true })
  ceramicsPorcelainDetails?: CeramicsPorcelainDetailsInput;

  @ValidateIf((o) => o.antiqueCategory === AntiqueCategory.JEWELLERY_SILVERWARE)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => JewellerySilverwareDetailsInput)
  @Field(() => JewellerySilverwareDetailsInput, { nullable: true })
  jewellerySilverwareDetails?: JewellerySilverwareDetailsInput;

  @ValidateIf((o) => o.antiqueCategory === AntiqueCategory.BOOKS_MAPS_DOCUMENTS)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BooksMapsDocumentsDetailsInput)
  @Field(() => BooksMapsDocumentsDetailsInput, { nullable: true })
  booksMapsDocumentsDetails?: BooksMapsDocumentsDetailsInput;

  @ValidateIf((o) => o.antiqueCategory === AntiqueCategory.CLOCKS_TIMEPIECES)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClocksTimepiecesDetailsInput)
  @Field(() => ClocksTimepiecesDetailsInput, { nullable: true })
  clocksTimepiecesDetails?: ClocksTimepiecesDetailsInput;

  @ValidateIf(
    (o) => o.antiqueCategory === AntiqueCategory.COINS_CURRENCY_STAMPS,
  )
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoinsCurrenciesStampsDetailsInput)
  @Field(() => CoinsCurrenciesStampsDetailsInput, { nullable: true })
  coinsCurrenciesStampsDetails?: CoinsCurrenciesStampsDetailsInput;
}

@InputType()
class ANSearch {
  @IsOptional()
  @Field(() => AntiqueCategory, { nullable: true })
  antiqueCategory?: AntiqueCategory;
  @IsOptional()
  @Field(() => AntiqueCondition, { nullable: true })
  antiqueCondition?: AntiqueCondition;
  @IsOptional() @Field(() => Int, { nullable: true }) minPrice?: number;
  @IsOptional() @Field(() => Int, { nullable: true }) maxPrice?: number;
  @IsOptional() @Field(() => String, { nullable: true }) memberId?: string;
  @IsOptional() @Field(() => String, { nullable: true }) text?: string;
}

@InputType()
export class AntiquesInquiry {
  @IsNotEmpty() @Min(1) @Field(() => Int) page: number;
  @IsNotEmpty() @Min(1) @Field(() => Int) limit: number;
  @IsOptional()
  @IsIn(availableAntiqueSorts)
  @Field(() => String, { nullable: true })
  sort?: string;
  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;
  @IsNotEmpty() @Field(() => ANSearch) search: ANSearch;
}

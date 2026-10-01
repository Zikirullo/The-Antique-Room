import { Schema } from 'mongoose';
import {
  AntiqueStatus,
  AntiqueCategory,
  AntiqueCondition,
  ArtMedium,
  MetalType,
  BookEdition,
  ClockMovementType,
  ClockWorkingStatus,
} from '../libs/enums/antique.enum';

const FurnitureDetailsSchema = new Schema(
  {
    furnitureStylePeriod: { type: String, required: true },
    woodType: { type: String, required: true },
    furnitureDimensions: { type: String, required: true },
    furnitureMaker: { type: String },
  },
  { _id: false },
);

const ArtDetailsSchema = new Schema(
  {
    artistName: { type: String, required: true },
    artMedium: { type: String, enum: ArtMedium, required: true },
    artSigned: { type: Boolean, required: true },
    artNote: { type: String },
  },
  { _id: false },
);

const CeramicsPorcelainDetailsSchema = new Schema(
  {
    maker: { type: String, required: true },
    trademark: { type: String, required: true },
    pattern: { type: String, required: true },
  },
  { _id: false },
);

const JewellerySilverwareDetailsSchema = new Schema(
  {
    metalType: { type: String, enum: MetalType, required: true },
    trademark: { type: String, required: true },
    gemstones: { type: String },
  },
  { _id: false },
);

const BooksMapsDocumentsDetailsSchema = new Schema(
  {
    edition: { type: String, enum: BookEdition, required: true },
    publisher: { type: String },
    condition: { type: String },
    yearPrinted: { type: String },
  },
  { _id: false },
);

const ClocksTimepiecesDetailsSchema = new Schema(
  {
    movementType: { type: String, enum: ClockMovementType, required: true },
    workingStatus: { type: String, enum: ClockWorkingStatus, required: true },
    maker: { type: String, required: true },
  },
  { _id: false },
);

const CoinsCurrenciesStampsDetailsSchema = new Schema(
  {
    denomination: { type: String, required: true },
    printYear: { type: String, required: true },
    countryOfOrigin: { type: String, required: true },
  },
  { _id: false },
);

const AntiqueSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Member' },

    antiqueStatus: {
      type: String,
      enum: AntiqueStatus,
      default: AntiqueStatus.DRAFT,
    },
    antiqueCategory: { type: String, enum: AntiqueCategory, required: true },
    antiqueCondition: { type: String, enum: AntiqueCondition, required: true },
    antiqueImages: { type: [String], required: true },
    antiqueDeclaration: { type: Boolean, required: true },
    antiqueEra: { type: String, required: true },
    antiqueOrigin: { type: String, required: true },
    antiqueDesc: { type: String },

    furnitureDetails: { type: FurnitureDetailsSchema },
    artDetails: { type: ArtDetailsSchema },
    ceramicsPorcelainDetails: { type: CeramicsPorcelainDetailsSchema },
    jewellerySilverwareDetails: { type: JewellerySilverwareDetailsSchema },
    booksMapsDocumentsDetails: { type: BooksMapsDocumentsDetailsSchema },
    clocksTimepiecesDetails: { type: ClocksTimepiecesDetailsSchema },
    coinsCurrenciesStampsDetails: { type: CoinsCurrenciesStampsDetailsSchema },

    antiquePrice: { type: Number, required: true },
    antiqueViews: { type: Number, default: 0 },
    antiqueLikes: { type: Number, default: 0 },
    antiqueComments: { type: Number, default: 0 },

    reviewRating: { type: Number, min: 1, max: 5 },
    reviewedAt: { type: Date },
    deletedAt: { type: Date },
    soldAt: { type: Date },
  },
  { timestamps: true },
);

export default AntiqueSchema;

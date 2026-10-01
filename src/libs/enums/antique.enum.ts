import { registerEnumType } from '@nestjs/graphql';

export enum AntiqueStatus {
  DRAFT = 'DRAFT',
  PENDING_AUTHENTICATION = 'PENDING_AUTHENTICATION',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  REJECTED = 'REJECTED',
  REMOVED = 'REMOVED',
}
registerEnumType(AntiqueStatus, { name: 'AntiqueStatus' });

export enum AntiqueCategory {
  FURNITURE = 'FURNITURE',
  ART = 'ART',
  CERAMICS_PORCELAIN = 'CERAMICS_PORCELAIN',
  JEWELLERY_SILVERWARE = 'JEWELLERY_SILVERWARE',
  BOOKS_MAPS_DOCUMENTS = 'BOOKS_MAPS_DOCUMENTS',
  CLOCKS_TIMEPIECES = 'CLOCKS_TIMEPIECES',
  COINS_CURRENCY_STAMPS = 'COINS_CURRENCY_STAMPS',
}
registerEnumType(AntiqueCategory, { name: 'AntiqueCategory' });

export enum AntiqueCondition {
  MINT = 'MINT',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  RESTORED = 'RESTORED',
}
registerEnumType(AntiqueCondition, { name: 'AntiqueCondition' });

export enum ArtMedium {
  OIL_ON_CANVAS = 'OIL_ON_CANVAS',
  WATERCOLOUR = 'WATERCOLOUR',
  BRONZE = 'BRONZE',
  INK = 'INK',
  MIXED_MEDIA = 'MIXED_MEDIA',
  OTHER = 'OTHER',
}
registerEnumType(ArtMedium, { name: 'ArtMedium' });

export enum MetalType {
  STERLING_SILVER = 'STERLING_SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  MIXED_OTHER = 'MIXED_OTHER',
}
registerEnumType(MetalType, { name: 'MetalType' });

export enum BookEdition {
  FIRST_EDITION = 'FIRST_EDITION',
  LATER_EDITION = 'LATER_EDITION',
  FACSIMILE = 'FACSIMILE',
  MANUSCRIPT_UNIQUE = 'MANUSCRIPT_UNIQUE',
}
registerEnumType(BookEdition, { name: 'BookEdition' });

export enum ClockMovementType {
  MECHANICAL = 'MECHANICAL',
  QUARTZ = 'QUARTZ',
  OTHER = 'OTHER',
}
registerEnumType(ClockMovementType, { name: 'ClockMovementType' });

export enum ClockWorkingStatus {
  WORKING = 'WORKING',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
  NON_WORKING = 'NON_WORKING',
}
registerEnumType(ClockWorkingStatus, { name: 'ClockWorkingStatus' });

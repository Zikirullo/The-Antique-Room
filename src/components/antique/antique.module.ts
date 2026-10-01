import { Module } from '@nestjs/common';
import { AntiqueService } from './antique.service';
import { AntiqueResolver } from './antique.resolver';

@Module({
  providers: [AntiqueService, AntiqueResolver]
})
export class AntiqueModule {}

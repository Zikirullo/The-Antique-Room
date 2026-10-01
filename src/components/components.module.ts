import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AntiqueModule } from './antique/antique.module';

@Module({
  imports: [MemberModule, AntiqueModule]
})
export class ComponentsModule {}

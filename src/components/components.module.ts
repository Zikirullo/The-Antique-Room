import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AntiqueModule } from './antique/antique.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MemberModule, AntiqueModule, AuthModule],
  providers: [],
})
export class ComponentsModule {}

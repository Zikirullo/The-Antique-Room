import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AntiqueModule } from './antique/antique.module';
import { AuthModule } from './auth/auth.module';
import { ViewModule } from './view/view.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [MemberModule, AntiqueModule, AuthModule, ViewModule, LikeModule],
  providers: [],
})
export class ComponentsModule {}

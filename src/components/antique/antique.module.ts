import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AntiqueSchema from '../../schemas/Antique.model';
import { AntiqueService } from './antique.service';
import { AntiqueResolver } from './antique.resolver';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Antique', schema: AntiqueSchema }]),
    AuthModule,
    MemberModule,
    ViewModule,
    LikeModule,
  ],
  providers: [AntiqueService, AntiqueResolver],
  exports: [AntiqueService],
})
export class AntiqueModule {}

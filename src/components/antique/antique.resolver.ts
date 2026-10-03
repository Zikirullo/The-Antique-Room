import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { ObjectId } from 'mongoose';
import { AntiqueService } from './antique.service';
import { Antique, Antiques } from '../../libs/dto/antique_dto/antique';
import {
  AntiqueInput,
  AntiquesInquiry,
} from '../../libs/dto/antique_dto/antique.input';
import { AntiqueUpdate } from '../../libs/dto/antique_dto/antique.update';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class AntiqueResolver {
  constructor(private readonly antiqueService: AntiqueService) {}

  @Roles(MemberType.SELLER)
  @UseGuards(RolesGuard)
  @Mutation(() => Antique)
  public async createAntique(
    @Args('input') input: AntiqueInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Antique> {
    console.log('Mutation: createAntique');
    input.memberId = memberId;
    return await this.antiqueService.createAntique(input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Antique)
  public async getAntique(
    @Args('antiqueId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Antique> {
    console.log('Query: getAntique');
    const antiqueId = shapeIntoMongoObjectId(input);
    return await this.antiqueService.getAntique(memberId, antiqueId);
  }

  @Roles(MemberType.SELLER)
  @UseGuards(RolesGuard)
  @Mutation(() => Antique)
  public async updateAntique(
    @Args('input') input: AntiqueUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Antique> {
    console.log('Mutation: updateAntique');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.antiqueService.updateAntique(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Antiques)
  public async getAntiques(
    @Args('input') input: AntiquesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Antiques> {
    console.log('Query: getAntiques');
    return await this.antiqueService.getAntiques(memberId, input);
  }
}

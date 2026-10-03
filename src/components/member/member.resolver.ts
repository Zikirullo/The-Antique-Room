import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { AuthenticationInput } from '../../libs/dto/member_dto/member.input';
import { Member } from '../../libs/dto/member_dto/member';
import { AuthPayload } from '../../libs/dto/auth.payload';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @Mutation(() => AuthPayload)
  public async authenticate(
    @Args('input') input: AuthenticationInput,
  ): Promise<AuthPayload> {
    return await this.memberService.authenticate(input);
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { MemberInput } from '../../libs/dto/member_dto/member.input';
import { Member } from '../../libs/dto/member_dto/member';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @Mutation(() => Member)
  public async signup(@Args('input') input: MemberInput): Promise<Member> {
    console.log('Mutaion signup');
    return await this.memberService.signup(input);
  }
}

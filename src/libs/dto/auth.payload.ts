import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from '../../libs/dto/member_dto/member';

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  accessToken: string;

  @Field(() => Member)
  member: Member;
}

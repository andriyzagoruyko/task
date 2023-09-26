import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';

@ObjectType()
export class LoginResponseDto {
  @Field()
  accessToken: string;

  @Field(() => UserEntity)
  user: UserEntity;
}

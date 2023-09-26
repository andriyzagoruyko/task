import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

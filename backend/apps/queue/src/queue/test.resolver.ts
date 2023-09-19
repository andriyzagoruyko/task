import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
  constructor() {}

  @Query(() => String)
  sayTest(): string {
    return 'Hello test!';
  }
}

import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatsDto {
  @Field(() => Int)
  totalSize: number;

  @Field(() => Int)
  count: number;
}

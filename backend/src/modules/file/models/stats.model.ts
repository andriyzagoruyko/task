import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatsModel {
  @Field(() => Int)
  totalSize: number;

  @Field(() => Int)
  count: number;
}

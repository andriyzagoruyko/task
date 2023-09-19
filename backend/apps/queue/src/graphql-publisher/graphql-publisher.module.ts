import { Module } from '@nestjs/common';
import { GraphQLPublisherService } from './graphql-publisher.service';

@Module({
  providers: [GraphQLPublisherService],
  exports: [GraphQLPublisherService],
})
export class GraphQLPublisherModule {}

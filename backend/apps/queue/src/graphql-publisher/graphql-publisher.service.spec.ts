import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLPublisherService } from './graphql-publisher.service';

describe('PublisherService', () => {
  let service: GraphQLPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphQLPublisherService],
    }).compile();

    service = module.get<GraphQLPublisherService>(GraphQLPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

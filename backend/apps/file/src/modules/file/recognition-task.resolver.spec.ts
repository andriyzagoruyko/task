import { Test, TestingModule } from '@nestjs/testing';
import { RecognitionTaskResolver } from './recognition-task.resolver';

describe('RecognitionTaskResolver', () => {
  let resolver: RecognitionTaskResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecognitionTaskResolver],
    }).compile();

    resolver = module.get<RecognitionTaskResolver>(RecognitionTaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

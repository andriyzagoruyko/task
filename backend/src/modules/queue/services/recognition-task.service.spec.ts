import { Test, TestingModule } from '@nestjs/testing';
import { RecognitionTaskService } from './recognition-task.service';

describe('RecognitionTaskService', () => {
  let service: RecognitionTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecognitionTaskService],
    }).compile();

    service = module.get<RecognitionTaskService>(RecognitionTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

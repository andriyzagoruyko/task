import { Test, TestingModule } from '@nestjs/testing';
import { QueueClientService } from './queue-client.service';

describe('QueueService', () => {
  let service: QueueClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueClientService],
    }).compile();

    service = module.get<QueueClientService>(QueueClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

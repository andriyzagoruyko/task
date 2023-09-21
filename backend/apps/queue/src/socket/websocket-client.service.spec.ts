import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketClientService } from './websocket-client.service';

describe('WebsocketService', () => {
  let service: WebsocketClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketClientService],
    }).compile();

    service = module.get<WebsocketClientService>(WebsocketClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

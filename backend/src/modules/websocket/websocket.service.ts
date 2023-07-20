import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

enum WebsocketEvents {
  PROGRESS = 'progress',
}

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  sendProgressToUser(userId: string, progress: number | null) {
    this.websocketGateway.wss
      .to(userId)
      .emit(WebsocketEvents.PROGRESS, { progress });
  }
}

import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

import { PubSub } from 'graphql-subscriptions';


enum WebsocketEvents {
  ProgressUpdated = 'progressUpdated',
}

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  sendProgressToUser(userId: string, progress: number | null) {
    this.websocketGateway.wss
      .to(userId)
      .emit(WebsocketEvents.ProgressUpdated, { progress });
  }


}

import { OnApplicationShutdown } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { WebsocketClientService } from './websocket-client.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnApplicationShutdown {
  private eventSubscription: Subscription;
  constructor(private readonly service: WebsocketClientService) {}

  afterInit(server: Server): void {
    this.eventSubscription = this.service.eventSubject$.subscribe({
      next: (event) => server.emit(event.name, event.data),
      error: (err) => server.emit('exception', err),
    });
  }

  onApplicationShutdown() {
    this.eventSubscription.unsubscribe();
  }
}

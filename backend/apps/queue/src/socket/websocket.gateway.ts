import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { WebsocketClientService } from './websocket-client.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class WebsocketGateway
  implements OnGatewayInit, OnApplicationShutdown, OnGatewayConnection
{
  private readonly logger = new Logger(WebsocketGateway.name);
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

  handleConnection(client) {
    this.logger.log(`User successfully connected: ${client.id}`);
  }
}

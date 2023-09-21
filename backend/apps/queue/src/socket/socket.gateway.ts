import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { SocketClientService } from './socket-client.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class SocketGateway
  implements OnGatewayInit, OnApplicationShutdown, OnGatewayConnection
{
  private eventSubscription: Subscription;
  constructor(private readonly service: SocketClientService) {}
  logger = new Logger(SocketGateway.name);

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

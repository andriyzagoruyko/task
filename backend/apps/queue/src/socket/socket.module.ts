import { Module } from '@nestjs/common';
import { SocketClientService } from './socket-client.service';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketClientService, SocketGateway],
  exports: [SocketClientService],
})
export class SocketModule {}

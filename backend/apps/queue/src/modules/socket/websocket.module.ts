import { Module } from '@nestjs/common';
import { WebsocketClientService } from './websocket-client.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketClientService, WebsocketGateway],
  exports: [WebsocketClientService],
})
export class WebsocketModule {}

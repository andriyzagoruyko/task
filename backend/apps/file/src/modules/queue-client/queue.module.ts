import {
  RABBITMQ_IMAGE_TOPIC,
  RABBITMQ_AUDIO_TOPIC,
} from '@app/shared/definitions';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { QueueClientService } from './queue.service';
import { ConfigService } from '@app/shared/config/config.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: RabbitMQFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [QueueClientService],
  exports: [QueueClientService],
})
export class QueueClientModule {}

function RabbitMQFactory(config: ConfigService) {
  return {
    exchanges: [
      { name: RABBITMQ_IMAGE_TOPIC, type: 'topic' },
      { name: RABBITMQ_AUDIO_TOPIC, type: 'topic' },
    ],
    uri: `amqp://${config.rabbitMq.user}:${config.rabbitMq.user}@${config.rabbitMq.host}:${config.rabbitMq.port}`,
    enableControllerDiscovery: true,
  };
}

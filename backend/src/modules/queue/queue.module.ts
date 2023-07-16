import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { QueueService } from './queue.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { QueueController } from './queue.controller';
import { ImageProcessingConsumer } from './consumers/image-processing.consumer';
import { FileModule } from '../file/file.module';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { AudioProcessingConsumer } from './consumers/audio-processing.consumer';
import { HttpModule } from '../http/http.module';

@Module({
  imports: [
    HttpModule,
    FileModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: RabbitMQFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [QueueService, ImageProcessingConsumer, AudioProcessingConsumer],
  exports: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}

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

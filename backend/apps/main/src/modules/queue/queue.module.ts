import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { QueueService } from './services/queue.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ImageProcessingConsumer } from './consumers/image-processing.consumer';
import { FileModule } from '../file/file.module';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from '../../definitions';
import { AudioProcessingConsumer } from './consumers/audio-processing.consumer';
import { HttpModule } from '../http/http.module';
import { QueueResolver } from './queue.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RecognitionTaskEntity,
  RecognitionTaskSchema,
} from './entities/recognition-task.entity';
import { RecognitionTaskService } from './services/recognition-task.service';
import { EventPublisherModule } from '../event-publisher/event-publisher.module';

@Module({
  imports: [
    HttpModule,
    EventPublisherModule,
    forwardRef(() => FileModule),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: RabbitMQFactory,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RecognitionTaskEntity.name, schema: RecognitionTaskSchema },
    ]),
  ],
  providers: [
    QueueService,
    ImageProcessingConsumer,
    AudioProcessingConsumer,
    QueueResolver,
    RecognitionTaskService,
  ],
  exports: [QueueService, RecognitionTaskService],
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

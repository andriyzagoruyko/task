import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { QueueService } from './services/queue.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ImageProcessingConsumer } from './consumers/image-processing.consumer';
import { FileModule } from '../file/file.module';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { AudioProcessingConsumer } from './consumers/audio-processing.consumer';
import { HttpModule } from '../http/http.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { QueueResolver } from './queue.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RecognitionTask,
  RecognitionTaskSchema,
} from './schemas/recognition-task.schema';
import { RecognitionTaskService } from './services/recognition-task.service';

@Module({
  imports: [
    HttpModule,
    WebsocketModule,
    forwardRef(() => FileModule),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: RabbitMQFactory,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RecognitionTask.name, schema: RecognitionTaskSchema },
    ]),
  ],
  providers: [
    QueueService,
    ImageProcessingConsumer,
    AudioProcessingConsumer,
    QueueResolver,
    RecognitionTaskService,
  ],
  exports: [QueueService],
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

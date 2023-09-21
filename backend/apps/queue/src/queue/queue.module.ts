import { ConfigModule } from '@app/shared/config/config.module';
import { ConfigService } from '@app/shared/config/config.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '../http/http.module';
import { AudioProcessingConsumer } from './consumers/audio-processing.consumer';
import { ImageProcessingConsumer } from './consumers/image-processing.consumer';
import {
  RecognitionTaskEntity,
  RecognitionTaskSchema,
} from './entities/recognition-task.entity';
import { RecognitionTaskResolver } from './recognition-task.resolver';
import { RecognitionTaskService } from './services/recognition-task.service';
import {
  RABBITMQ_IMAGE_TOPIC,
  RABBITMQ_AUDIO_TOPIC,
} from '@app/shared/definitions';
import { FileResolver } from './file.resolver';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: RabbitMQFactory,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RecognitionTaskEntity.name, schema: RecognitionTaskSchema },
    ]),
  ],
  providers: [
    ImageProcessingConsumer,
    AudioProcessingConsumer,
    RecognitionTaskService,
    RecognitionTaskResolver,
    FileResolver,
  ],
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

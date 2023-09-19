import { ConfigModule } from '@app/shared/config/config.module';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { HttpModule } from './http/http.module';
import { ConfigService } from '@app/shared/config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { GraphQLPublisherModule } from './graphql-publisher/graphql-publisher.module';

import {
  RABBITMQ_IMAGE_TOPIC,
  RABBITMQ_AUDIO_TOPIC,
} from '@app/shared/definitions';
import { AudioProcessingConsumer } from './queue/consumers/audio-processing.consumer';
import { ImageProcessingConsumer } from './queue/consumers/image-processing.consumer';
import {
  RecognitionTaskEntity,
  RecognitionTaskSchema,
} from './queue/entities/recognition-task.entity';
import { QueueResolver } from './queue/queue.resolver';
import { RecognitionTaskService } from './queue/services/recognition-task.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          dbName: config.queueDatabase.name,
          auth: {
            username: config.queueDatabase.user,
            password: config.queueDatabase.pass,
          },
          uri: `mongodb://${config.queueDatabase.host}:${config.queueDatabase.port}`,
        };
      },
      inject: [ConfigService],
    }),

    HttpModule,
    GraphQLPublisherModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: RabbitMQFactory,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RecognitionTaskEntity.name, schema: RecognitionTaskSchema },
    ]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      playground: true,
    }),
  ],
  providers: [
    ImageProcessingConsumer,
    AudioProcessingConsumer,
    RecognitionTaskService,
    QueueResolver,
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

import { ConfigModule } from '@app/shared/config/config.module';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from '@app/shared/config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueModule } from './queue/queue.module';
import { FileEntity } from './queue/entities/file.entity';
import { WebsocketModule } from './socket/websocket.module';

@Module({
  imports: [
    ConfigModule,
    QueueModule,
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
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
      buildSchemaOptions: {
        orphanedTypes: [FileEntity],
      },
    }),
  ],
})
export class AppModule {}

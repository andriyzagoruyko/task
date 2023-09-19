import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import migrations from './migration';
//import { JoiPipeModule } from 'nestjs-joi';
import { FileModule } from './modules/file/file.module';

import { QueueClientModule } from './modules/queue-client/queue.module';
import { HttpModule } from './modules/http/http.module';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@app/shared/config/config.module';
import { ConfigService } from '@app/shared/config/config.service';
import { MIGRATION_TABLE_NAME, ENTITIES_PATHS } from '@app/shared/definitions';

@Module({
  imports: [
    QueueClientModule,
    FileModule,
    ConfigModule,
    //JoiPipeModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.fileDatabase.host,
        ssl: config.fileDatabase.ssl,
        port: config.fileDatabase.port,
        username: config.fileDatabase.user,
        password: config.fileDatabase.pass,
        database: config.fileDatabase.name,
        autoLoadEntities: true,
        migrationsTableName: MIGRATION_TABLE_NAME,
        migrations: migrations,
        entities: ENTITIES_PATHS,
        namingStrategy: new SnakeNamingStrategy(),
        migrationsRun: true,
        extra: { connectionLimit: config.fileDatabase.maxConnections },
        logging: ['error'],
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      playground: true,
    }),
    /*
        GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': { path: '/subscriptions' },
        'subscriptions-transport-ws': false,
      },
    }),*/
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
  ],
})
export class AppModule {}

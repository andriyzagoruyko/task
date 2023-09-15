import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule } from './config/config.module';
import migrations from './migration';
//import { JoiPipeModule } from 'nestjs-joi';
import { FileModule } from './modules/file/file.module';
import { MIGRATION_TABLE_NAME, ENTITIES_PATHS } from './definitions';
import { QueueModule } from './modules/queue/queue.module';
import { HttpModule } from './modules/http/http.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { PublisherModule } from './modules/publisher/publisher.module';

@Module({
  imports: [
    QueueModule,
    FileModule,
    ConfigModule,
    //JoiPipeModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.database.host,
        ssl: config.database.ssl,
        port: config.database.port,
        username: config.database.user,
        password: config.database.pass,
        database: config.database.name,
        autoLoadEntities: true,
        migrationsTableName: MIGRATION_TABLE_NAME,
        migrations: migrations,
        entities: ENTITIES_PATHS,
        namingStrategy: new SnakeNamingStrategy(),
        migrationsRun: true,
        extra: { connectionLimit: config.database.maxConnections },
        logging: ['error'],
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': { path: '/subscriptions' },
        'subscriptions-transport-ws': false,
      },
    }),
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
    PublisherModule,
  ],
})
export class AppModule {}

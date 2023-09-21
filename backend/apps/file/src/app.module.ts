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
import { ConfigModule } from '@app/shared/config/config.module';
import { ConfigService } from '@app/shared/config/config.service';
import { MIGRATION_TABLE_NAME, ENTITIES_PATHS } from '@app/shared/definitions';
import { LoggingPlugin } from '@app/shared/apollo-plugins/logging-plugin';
import { RecognitionTaskEntity } from './modules/file/entities/recognition-task.entity';

@Module({
  imports: [
    LoggingPlugin,
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
      autoSchemaFile: { federation: 2 },
      buildSchemaOptions: {
        orphanedTypes: [RecognitionTaskEntity],
      },
    }),
    HttpModule,
  ],
})
export class AppModule {}

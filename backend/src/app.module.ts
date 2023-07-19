import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule } from './config/config.module';
import migrations from './migration';
import { JoiPipeModule } from 'nestjs-joi';
import { FileModule } from './modules/file/file.module';
import { MIGRATION_TABLE_NAME, ENTITIES_PATHS } from './definitions';
import { QueueModule } from './modules/queue/queue.module';
import { HttpModule } from './modules/http/http.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    QueueModule,
    FileModule,
    ConfigModule,
    JoiPipeModule.forRoot(),
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
    HttpModule,
    WebsocketModule,
  ],
})
export class AppModule {}

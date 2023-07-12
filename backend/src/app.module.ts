import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule } from './config/config.module';

export const MIGRATION_TABLE_NAME = '__migrations';
export const MIGRATION_PATH = path.join(__dirname + '/migrations/*.{ts,js}');
export const ENTITIES_PATHS = [
  // NOTE: If this creates dependency loops, you will have to manually specify the
  // list of entity files in a way that prevents a loop from being created.
  path.join(__dirname + '/**/*.entity.{ts,js}'),
];

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      { name: 'ITEM_MICROSERVICE', transport: Transport.TCP },
    ]),
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
        migrations: [MIGRATION_PATH],
        entities: ENTITIES_PATHS,
        namingStrategy: new SnakeNamingStrategy(),
        migrationsRun: true,
        extra: {
          connectionLimit: config.database.maxConnections,
        },
        logging: ['error'],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

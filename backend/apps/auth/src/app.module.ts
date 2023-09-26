import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@app/shared/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@app/shared/config/config.service';
import { ENTITIES_PATHS, MIGRATION_TABLE_NAME } from '@app/shared/definitions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import migrations from './migrations';
import { HttpExceptionsFilter } from '@app/shared/lib/http-exceptions.filter';
import { LoggingInterceptor } from '@app/shared/lib/logging-interceptor';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    AuthModule,
    UserModule,
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
        orphanedTypes: [],
      },
      context: async ({ req }) => ({ headers: req.headers }),
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}

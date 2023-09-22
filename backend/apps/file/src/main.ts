import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@app/shared/config/config.service';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
process.on('unhandledRejection', console.log);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.fileHttpPort);
}

bootstrap();

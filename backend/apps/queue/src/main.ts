import { NestFactory } from '@nestjs/core';
import { QueueModule } from './app.module';
import { ConfigService } from '@app/shared/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.queueHttpPort);
}
bootstrap();

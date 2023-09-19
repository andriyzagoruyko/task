import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '../../../libs/shared/src/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.fileHttpPort);
  console.log(`Nest application started on port ${configService.fileHttpPort}`);
  console.log(
    `GraphQl API started at http://localhost:${configService.fileHttpPort}/graphql`,
  );
}

bootstrap();

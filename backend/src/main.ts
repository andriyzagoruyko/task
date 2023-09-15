import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.httpPort);

  console.log(`Nest application started on port ${configService.httpPort}`);
  console.log(
    `GraphQl API started at http://localhost:${configService.httpPort}/graphql`,
  );
}

bootstrap();

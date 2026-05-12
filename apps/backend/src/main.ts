import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }),
  );
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`RentDirect API listening on http://localhost:${port}`);
}

bootstrap();

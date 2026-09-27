import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app =
    await NestFactory.create(
      NotificationModule,
    );

  app.enableCors();

  await app.listen(3005);

  console.log(
    'Notification Service Running On Port 3005',
  );
}

bootstrap();
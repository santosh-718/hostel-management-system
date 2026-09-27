import { NestFactory }
from '@nestjs/core';

import { AppModule }
from './app.module';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableCors();

  await app.listen(3000);

  console.log(
    '✅ API Gateway Running On Port 3000',
  );
}

bootstrap();

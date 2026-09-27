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

  await app.listen(3008);

  console.log(
    '✅ Complaint Service Running On Port 3008',
  );
}

bootstrap();

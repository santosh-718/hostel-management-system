import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableCors();

  await app.listen(3006);

  console.log(
    'Auth Service Running On Port 3006',
  );
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Nest Study')
  .setDescription('Docs Api Nest Study')
  .setVersion('1.0')
  .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument) 

  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  app.enableShutdownHooks();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

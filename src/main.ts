import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppFilter } from './filters/app.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AppFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('CoreInfra Test')
    .setDescription('API documentation for CoreInfra test')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = configService.get<number>('PORT') || 3000;

  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}/api`);
}
bootstrap();

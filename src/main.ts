/* eslint-disable no-console */
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { RpcExceptionFilter } from './shared/exception/rpc-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const env = configService.get('NODE_ENV', 'development');

  const version = 'v1.0';
  const globalPrefix = `/api/user-service/${version}`;
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: configService.get('PORT'),
    },
  });

  if (env === 'development') {
    const options = new DocumentBuilder()
      .setTitle('User API')
      .setDescription('The User API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs/user', app, document);
  }
  app.enableCors({
    origin: [...configService.get('CORS_ORIGINS', '').split(',')],
  });

  await app.startAllMicroservices();

  const port = configService.get('PORT') || '3000';
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`with ${env} environment`);
  console.log(`docs ${await app.getUrl()}/docs/user`);
}
bootstrap();

import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

import 'src/infra/extensions/index';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import * as moment from 'moment-timezone';
import { isValidValue } from '@utils/index';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ContaModule } from '@app/conta/conta.module';
import { TransformInterceptor } from '@infra/interceptors/transformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(ConsoleLogger);

  const envVars = configService.getAt('environment');

  if (isValidValue(envVars)) {
    for (const key in envVars) {
      process.env[key] = envVars[key];
    }
  }

  moment().tz(process.env.TZ);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.enableCors();

  app.setGlobalPrefix('api');

  configurarSwagger(app);

  await app.listen(9090);

  logger.log('Aplicação iniciada na porta 9090');
}

function configurarSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Gestão Contas')
    .setDescription('API Simples Gestão de Contas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [ContaModule],
  });
  SwaggerModule.setup('api', app, document);
}

bootstrap();

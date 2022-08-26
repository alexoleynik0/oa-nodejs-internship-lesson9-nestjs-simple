import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';

import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, configService));

  // NOTE: it seems that this interceptor is added by default anyway
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000);
}
bootstrap();

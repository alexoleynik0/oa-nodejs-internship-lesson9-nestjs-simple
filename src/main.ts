import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';

import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const apiVersionDefault = '1';

  app.setGlobalPrefix('api');

  app.enableVersioning({
    defaultVersion: apiVersionDefault,
    type: VersioningType.URI,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, configService));

  // NOTE: it seems that this interceptor is added by default anyway
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const docsPath = `/api/v${apiVersionDefault}/docs`; // NOTE: first slash here is important
  // add basic auth for the docs
  const expressAdapter = app.getHttpAdapter();
  expressAdapter.use(
    docsPath,
    basicAuth({
      challenge: true,
      users: configService.get<{ [username: string]: string }>(
        'docs.basic_auth.users',
      ),
    }),
  );
  // configure swagger
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('docs.name'))
    .setDescription(configService.get<string>('docs.description'))
    .setVersion(`${apiVersionDefault}.0`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsPath, app, document);

  await app.listen(3000);
}
bootstrap();

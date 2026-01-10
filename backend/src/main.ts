import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import passport from 'passport';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { EnvService } from '@/config/env/env.service';
import { SuccessResponseInterceptor } from '@auth/common/interceptors/success-response.interceptor';
import { ErrorResponseInterceptor } from './common/interceptors/error-response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '@/config/swagger/swagger.config';
import { requestContextMiddleware } from './common/context/request-context.middleware';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


/**
 * Bootstrap de la aplicación.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const env = app.get(EnvService);

  app.use(passport.initialize());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter(),
    new GlobalExceptionFilter(),
  );

  if (env.nodeEnv !== 'production') {
    const document = SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(requestContextMiddleware);

  app.enableCors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  await app.listen(env.port);
}

bootstrap();

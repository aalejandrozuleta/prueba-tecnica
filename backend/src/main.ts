import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { EnvService } from '@/config/env/env.service';
import { SuccessResponseInterceptor } from '@auth/common/interceptors/success-response.interceptor';
import { ErrorResponseInterceptor } from './common/interceptors/error-response.interceptor';

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
  );

    app.useGlobalInterceptors(
    app.get(ErrorResponseInterceptor),
    app.get(SuccessResponseInterceptor),
  );

  

  app.enableCors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(env.port);
}

bootstrap();

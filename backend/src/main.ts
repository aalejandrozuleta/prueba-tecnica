import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { I18nValidationPipe } from 'nestjs-i18n';
import passport from 'passport';

import { EnvService } from '@/config/env/env.service';
import { swaggerConfig } from '@/config/swagger/swagger.config';

import { AppModule } from './app.module';

/**
 * Bootstrap de la aplicación.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const env = app.get(EnvService);

  app.use(passport.initialize());

  if (env.nodeEnv !== 'production') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // app.use(requestContextMiddleware);
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
    }),
  );
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

  app.use(cookieParser());

  await app.listen(env.port);
  console.info('Aplicación corriendo', env.port);
}
bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación', error);
  process.exit(1);
});

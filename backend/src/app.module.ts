import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import path from 'path';

import { validateEnv } from '@/config/env/env.config';
import { EnvService } from '@/config/env/env.service';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './infrastructure/prisma/config/prisma.module';
import { CommonModule } from './common/common.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { DebtModule } from './modules/debt.module';

@Module({
  imports: [
    // 1️⃣ Configuración de envs (primero siempre)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.development',
        '.env.test',
        '.env',
        '.env.production',
      ],
      validate: validateEnv,
    }),

    // 2️⃣ I18n usando envs correctamente
        I18nModule.forRoot({
      fallbackLanguage: 'es',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(process.cwd(), 'assets/i18n'),
        watch: true,
      },
      resolvers: [
        AcceptLanguageResolver,
      ],
    }),

    CommonModule,
    HealthModule,
    PrismaModule,
    UserModule,
    AuthModule,
    DebtModule,
  ],
  providers: [EnvService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    }
  ],
  exports: [EnvService],
})
export class AppModule { }

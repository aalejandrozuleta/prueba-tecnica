import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';

import { validateEnv } from '@/config/env/env.config';
import { EnvService } from '@/config/env/env.service';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './infrastructure/prisma/config/prisma.module';
import { CommonModule } from './common/common.module';

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
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        fallbackLanguage: 'es',
        loader: I18nJsonLoader,
        loaderOptions: {
          path: path.join(process.cwd(), 'dist/assets/i18n'),
          watch: config.get('NODE_ENV') !== 'production',
        },
        resolvers: [
          { use: QueryResolver, options: ['lang'] },
          { use: HeaderResolver, options: ['x-lang', 'accept-language'] },
          { use: AcceptLanguageResolver },
        ],
      }),
    }),

    CommonModule,
    HealthModule,
    PrismaModule,
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class AppModule { }

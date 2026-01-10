import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';

import { ErrorResponseInterceptor } from './interceptors/error-response.interceptor';
import { SuccessResponseInterceptor } from './interceptors/success-response.interceptor';
import { EnvModule } from '@/config/env/env.module';

@Module({
  imports: [
    EnvModule, // 🔑 NECESARIO
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    Reflector, 
  ],
})
export class CommonModule {}

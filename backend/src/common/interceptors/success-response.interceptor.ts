// src/common/interceptors/success-response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { EnvService } from '@/config/env/env.service';
import {
  RAW_RESPONSE_KEY,
} from '../decorators/raw-response.decorator';
import {
  SKIP_SANITIZE_KEY,
} from '../decorators/skip-sanitize.decorator';
import { createSuccessResponseBuilder } from '../response/success-response.builder';

/**
 * Interceptor global de respuestas exitosas.
 */
@Injectable()
export class SuccessResponseInterceptor
  implements NestInterceptor {
  constructor(
    private readonly env: EnvService,
    private readonly reflector: Reflector,
  ) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const isRaw = this.reflector.get<boolean>(
      RAW_RESPONSE_KEY,
      context.getHandler(),
    );

    if (isRaw) {
      return next.handle();
    }

    const skipSanitize =
      this.reflector.get<boolean>(
        SKIP_SANITIZE_KEY,
        context.getHandler(),
      );

    const buildResponse =
      createSuccessResponseBuilder({
        sanitizeData:
          this.env.nodeEnv === 'production' &&
          !skipSanitize,
      });

    return next.handle().pipe(
      map((data) =>
        buildResponse('Operación exitosa', data),
      ),
    );
  }
}

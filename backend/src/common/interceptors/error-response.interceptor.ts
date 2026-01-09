// src/common/interceptors/error-response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { I18nService } from 'nestjs-i18n';

import {
  ERROR_CODES,
  ErrorCode,
} from '../constants/error-codes.constant';
import { buildErrorResponse } from '../response/error-response.builder';


/**
 * Interceptor global de errores.
 */
@Injectable()
export class ErrorResponseInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly i18n: I18nService,
  ) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const code = this.mapStatusToCode(status);

        const message = this.i18n.t(code);

        const response = buildErrorResponse({
          message,
          code,
          details:
            error instanceof HttpException
              ? error.getResponse()
              : undefined,
        });

        return throwError(() =>
          new HttpException(response, status),
        );
      }),
    );
  }

  private mapStatusToCode(
    status: number,
  ): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ERROR_CODES.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ERROR_CODES.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ERROR_CODES.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ERROR_CODES.NOT_FOUND;
      default:
        return ERROR_CODES.INTERNAL_ERROR;
    }
  }
}

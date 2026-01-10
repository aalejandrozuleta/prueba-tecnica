import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  I18nContext,
  I18nService,
  I18nValidationException,
} from 'nestjs-i18n';

import { DomainException } from '@/domain/exceptions/DomainException';
import { ERROR_CODES } from '../constants/error-codes.constant';
import { ERROR_HTTP_STATUS } from '../constants/error-status.map';
import { extractValidationMessages } from '../utils/extract-validation-messages.util';
import { translateValidationMessages } from '../utils/translate-validation-messages.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly i18nService: I18nService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const i18n = I18nContext.current();
    const translate = (
      key: string,
      args?: Record<string, unknown>,
    ) =>
      i18n
        ? i18n.translate(key, { args })
        : this.i18nService.translate(key, { args });

    /**
     * 1️⃣ VALIDACIONES i18n (nestjs-i18n ValidationPipe)
     */
    if (exception instanceof I18nValidationException) {
      const rawMessages = extractValidationMessages(exception.errors);

      const details = translateValidationMessages(
        rawMessages,
        this.i18nService,
      );

      httpAdapter.reply(
        response,
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: translate(ERROR_CODES.VALIDATION_ERROR),
            details,
          },
        },
        ERROR_HTTP_STATUS[ERROR_CODES.VALIDATION_ERROR],
      );
      return;
    }

    /**
     * 2️⃣ VALIDACIONES CLÁSICAS (BadRequestException)
     */
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;

      const details = Array.isArray(res?.message)
        ? res.message
        : undefined;

      httpAdapter.reply(
        response,
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: translate(ERROR_CODES.VALIDATION_ERROR),
            details,
          },
        },
        ERROR_HTTP_STATUS[ERROR_CODES.VALIDATION_ERROR],
      );
      return;
    }

    /**
     * 3️⃣ ERRORES DE DOMINIO (DomainException + i18n)
     */
    if (exception instanceof DomainException) {
      const message = translate(
        exception.i18nKey,
        exception.i18nArgs,
      );

      httpAdapter.reply(
        response,
        {
          success: false,
          error: {
            code: exception.code,
            message,
            details: exception.i18nArgs,
          },
        },
        exception.status,
      );
      return;
    }

    /**
     * 4️⃣ ERRORES HTTP (NestJS / Infraestructura)
     */
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as any;

      httpAdapter.reply(
        response,
        {
          success: false,
          error: {
            code: res?.code ?? ERROR_CODES.INTERNAL_ERROR,
            message:
              res?.message ??
              translate(ERROR_CODES.INTERNAL_ERROR),
            details: res?.details,
          },
        },
        status,
      );
      return;
    }

    /**
     * 5️⃣ FALLBACK (errores no controlados)
     */
    httpAdapter.reply(
      response,
      {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: translate(ERROR_CODES.INTERNAL_ERROR),
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

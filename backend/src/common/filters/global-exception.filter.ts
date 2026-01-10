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

import { ERROR_CODES, ErrorCode } from '../constants/error-codes.constant';
import { ERROR_HTTP_STATUS } from '../constants/error-status.map';
import { extractValidationMessages } from '../utils/extract-validation-messages.util';
import { translateValidationMessages } from '../utils/translate-validation-messages.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly i18nService: I18nService,
  ) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const i18n = I18nContext.current();
    const translate = (key: string) =>
      i18n ? i18n.translate(key) : this.i18nService.translate(key);

    /**
     * 1️⃣ VALIDACIONES i18n (I18nValidationPipe)
     */
    if (exception instanceof I18nValidationException) {
      const rawMessages = extractValidationMessages(
        exception.errors,
      );

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
     * 2️⃣ VALIDACIONES CLÁSICAS
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
     * 3️⃣ ERRORES DE DOMINIO / HTTP
     */
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;

      const errorCode: ErrorCode =
        res?.code ?? ERROR_CODES.INTERNAL_ERROR;

      httpAdapter.reply(
        response,
        {
          success: false,
          error: {
            code: errorCode,
            message: translate(errorCode),
            details: res?.details,
          },
        },
        exception.getStatus(),
      );
      return;
    }

    /**
     * 4️⃣ FALLBACK
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

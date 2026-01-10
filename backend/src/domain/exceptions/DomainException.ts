import { HttpException } from '@nestjs/common';
import { ErrorCode } from '@auth/common/constants/error-codes.constant';
import { ERROR_HTTP_STATUS } from '@auth/common/constants/error-status.map';

/**
 * Excepción base de dominio.
 * Extiende HttpException para que Nest NO la destruya.
 */
export class DomainException extends HttpException {
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(code: ErrorCode, details?: unknown) {
    super(
      {
        code,
        details,
      },
      ERROR_HTTP_STATUS[code],
    );

    this.code = code;
    this.details = details;
  }
}

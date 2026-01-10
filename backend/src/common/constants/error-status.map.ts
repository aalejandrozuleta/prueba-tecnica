import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES, ErrorCode } from './error-codes.constant';

/**
 * Mapa centralizado de ErrorCode → HTTP Status
 */
export const ERROR_HTTP_STATUS: Record<ErrorCode, HttpStatus> = {
  [ERROR_CODES.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR, // 500
  [ERROR_CODES.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,         // 400
  [ERROR_CODES.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,            // 401
  [ERROR_CODES.FORBIDDEN]: HttpStatus.FORBIDDEN,                  // 403
  [ERROR_CODES.NOT_FOUND]: HttpStatus.NOT_FOUND,                  // 404
  [ERROR_CODES.USER_EMAIL_ALREADY_EXISTS]: HttpStatus.CONFLICT,   // 409
};

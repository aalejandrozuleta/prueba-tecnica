/* eslint-disable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access
*/
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nContext, I18nService, I18nValidationException } from 'nestjs-i18n';

import { DomainException } from '@/domain/exceptions/DomainException';

import { ERROR_CODES } from '../constants/error-codes.constant';
import { ERROR_HTTP_STATUS } from '../constants/error-status.map';
import { extractValidationMessages } from '../utils/extract-validation-messages.util';
import { translateValidationMessages } from '../utils/translate-validation-messages.util';

/**
 * Filtro global de excepciones de la aplicación.
 *
 * @remarks
 * Este filtro captura **todas las excepciones no manejadas** que ocurren
 * durante el ciclo de vida de una solicitud HTTP y las transforma en una
 * respuesta estandarizada.
 *
 * Centraliza el manejo de:
 * - Errores de validación (`class-validator` + `nestjs-i18n`)
 * - Errores de dominio
 * - Excepciones HTTP de NestJS
 * - Errores no controlados (fallback)
 *
 * Garantiza:
 * - Estructura de error consistente
 * - Mensajes internacionalizados
 * - Separación clara entre dominio, aplicación e infraestructura
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Crea una nueva instancia del filtro global de excepciones.
   *
   * @param adapterHost
   * Adaptador HTTP de NestJS utilizado para enviar la respuesta
   * de forma agnóstica al framework subyacente (Express, Fastify).
   *
   * @param i18nService
   * Servicio de internacionalización utilizado como respaldo
   * cuando no existe un contexto i18n activo.
   */
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Captura y procesa cualquier excepción lanzada durante
   * la ejecución de una solicitud HTTP.
   *
   * @remarks
   * El flujo de manejo de errores sigue el siguiente orden:
   * 1. Errores de validación con i18n (`I18nValidationException`)
   * 2. Errores de validación clásicos (`BadRequestException`)
   * 3. Errores de dominio (`DomainException`)
   * 4. Excepciones HTTP de NestJS
   * 5. Error interno no controlado (fallback)
   *
   * @param exception
   * Excepción capturada, de tipo desconocido.
   *
   * @param host
   * Contexto de ejecución que permite acceder a la capa HTTP.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const i18n = I18nContext.current();
    const translate = (key: string, args?: Record<string, unknown>) =>
      i18n ? i18n.translate(key, { args }) : this.i18nService.translate(key, { args });

    /**
     * 1️⃣ VALIDACIONES i18n (ValidationPipe de nestjs-i18n)
     *
     * @remarks
     * Maneja errores producidos por validaciones de DTOs con mensajes
     * internacionalizados.
     */
    if (exception instanceof I18nValidationException) {
      const rawMessages = extractValidationMessages(exception.errors);

      const details = translateValidationMessages(rawMessages, this.i18nService);

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
     *
     * @remarks
     * Captura errores de validación que no provienen de `nestjs-i18n`,
     * típicamente generados por pipes o validaciones manuales.
     */
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;

      const details = Array.isArray(res?.message) ? res.message : undefined;

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
     * 3️⃣ ERRORES DE DOMINIO
     *
     * @remarks
     * Maneja excepciones controladas del dominio, permitiendo:
     * - Códigos de error específicos
     * - Mensajes internacionalizados
     * - Estados HTTP definidos por la lógica de negocio
     */
    if (exception instanceof DomainException) {
      const message = translate(exception.i18nKey, exception.i18nArgs);

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
     * 4️⃣ ERRORES HTTP DE NESTJS
     *
     * @remarks
     * Maneja excepciones lanzadas por NestJS o la capa de infraestructura,
     * preservando el código de estado HTTP original.
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
            message: res?.message ?? translate(ERROR_CODES.INTERNAL_ERROR),
            details: res?.details,
          },
        },
        status,
      );
      return;
    }

    /**
     * 5️⃣ FALLBACK GLOBAL
     *
     * @remarks
     * Maneja cualquier error no controlado, evitando la exposición
     * de información sensible y garantizando una respuesta uniforme.
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

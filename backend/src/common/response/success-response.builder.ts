import { sanitize } from './sanitize.util';

/**
 * Representa una respuesta estándar de éxito.
 *
 * @typeParam T
 * Tipo de los datos retornados en la respuesta.
 *
 * @remarks
 * Esta interfaz define la estructura base utilizada para comunicar
 * respuestas exitosas al cliente de forma consistente en toda la aplicación.
 */
export interface SuccessResponse<T> {
  /**
   * Mensaje legible que describe el resultado exitoso de la operación.
   */
  message: string;

  /**
   * Datos retornados por la operación.
   *
   * @remarks
   * Este campo es opcional y puede no estar presente en operaciones
   * que no retornan información adicional.
   */
  data?: T;
}

/**
 * Crea un constructor de respuestas exitosas.
 *
 * @remarks
 * Esta función permite generar un builder desacoplado del entorno
 * y del framework (por ejemplo, NestJS), facilitando su reutilización
 * en distintos contextos como controladores HTTP, gateways o adaptadores.
 *
 * @param options
 * Opciones de configuración del constructor de respuestas.
 *
 * @returns
 * Una función encargada de construir respuestas exitosas.
 */
export function createSuccessResponseBuilder(options: { sanitizeData: boolean }) {
  /**
   * Construye una respuesta exitosa estándar.
   *
   * @typeParam T
   * Tipo de los datos incluidos en la respuesta.
   *
   * @param message
   * Mensaje legible que describe el resultado exitoso.
   *
   * @param data
   * Datos asociados a la operación, si existen.
   *
   * @returns
   * Un objeto que cumple con la interfaz `SuccessResponse`.
   */
  return function buildSuccessResponse<T extends object>(
    message: string,
    data?: T | T[],
  ): SuccessResponse<T> {
    const safeData = options.sanitizeData && data ? sanitize(data) : data;

    return {
      message,
      ...(safeData !== undefined ? { data: safeData as T } : {}),
    };
  };
}

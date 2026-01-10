/**
 * Excepción base del dominio con soporte para internacionalización (i18n).
 *
 * @remarks
 * Esta clase actúa como la raíz de todas las excepciones de dominio.
 * Permite representar errores de negocio de forma controlada,
 * desacoplada de frameworks y preparada para traducción mediante
 * claves i18n.
 *
 * Las excepciones de dominio deben:
 * - Representar violaciones de reglas de negocio.
 * - Contener un código de error estable.
 * - Definir el estado HTTP apropiado.
 * - Proveer claves y argumentos para internacionalización.
 */
export class DomainException extends Error {
  /**
   * Código de error de dominio.
   *
   * @remarks
   * Identificador estable utilizado por el cliente y por los filtros
   * de excepciones para clasificar el error.
   */
  readonly code: string;

  /**
   * Código de estado HTTP asociado al error.
   */
  readonly status: number;

  /**
   * Clave de internacionalización del mensaje de error.
   */
  readonly i18nKey: string;

  /**
   * Argumentos opcionales utilizados en la traducción i18n.
   */
  readonly i18nArgs?: Record<string, unknown>;

  /**
   * Crea una nueva excepción de dominio.
   *
   * @param params
   * Parámetros necesarios para construir la excepción.
   *
   * @param params.code
   * Código de error de dominio.
   *
   * @param params.status
   * Código de estado HTTP asociado.
   *
   * @param params.i18nKey
   * Clave utilizada para la traducción del mensaje.
   *
   * @param params.i18nArgs
   * Argumentos opcionales para la traducción del mensaje.
   */
  constructor(params: {
    code: string;
    status: number;
    i18nKey: string;
    i18nArgs?: Record<string, unknown>;
  }) {
    super(params.code);
    this.code = params.code;
    this.status = params.status;
    this.i18nKey = params.i18nKey;
    this.i18nArgs = params.i18nArgs;
  }
}

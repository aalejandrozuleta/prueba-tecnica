/**
 * Excepción base del dominio (i18n-ready)
 */
export class DomainException extends Error {
  readonly code: string;
  readonly status: number;
  readonly i18nKey: string;
  readonly i18nArgs?: Record<string, unknown>;

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

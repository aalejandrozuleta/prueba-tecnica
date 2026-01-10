import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Interfaz que define los datos que se pueden almacenar en el contexto de una solicitud.
 */
interface RequestContextData {
  lang?: string;
}

/**
 * Almacenamiento asincrónico para el contexto de solicitud.
 */
const storage = new AsyncLocalStorage<RequestContextData>();

/**
 * Servicio para gestionar datos específicos del contexto de una solicitud.
 * Utiliza `AsyncLocalStorage` para almacenar y recuperar información como el idioma (`lang`).
 */
export class RequestContextService {
  /**
   * Ejecuta una función dentro de un nuevo contexto de solicitud.
   *
   * @param context Datos del contexto
   * @param callback Función a ejecutar
   * @returns Resultado del callback
   */
  static run<T>(context: RequestContextData, callback: (...args: unknown[]) => T): T {
    return storage.run(context, callback);
  }

  /**
   * Obtiene un valor del contexto actual.
   *
   * @param key Clave del valor a obtener
   * @returns Valor asociado o `undefined`
   */
  static get<T extends keyof RequestContextData>(key: T): RequestContextData[T] | undefined {
    // eslint-disable-next-line security/detect-object-injection
    return storage.getStore()?.[key];
  }

  /**
   * Obtiene el idioma actual del contexto.
   *
   * @returns Código de idioma
   */
  static getLang(): string {
    return this.get('lang') ?? 'es';
  }

  /**
   * Establece un valor en el contexto actual.
   *
   * @param key Clave del dato
   * @param value Valor a establecer
   */
  static set<T extends keyof RequestContextData>(key: T, value: RequestContextData[T]): void {
    const store = storage.getStore();
    if (store) {
      // eslint-disable-next-line security/detect-object-injection
      store[key] = value;
    }
  }

  /**
   * Establece el idioma actual en el contexto.
   *
   * @param lang Código de idioma
   */
  static setLang(lang: string): void {
    this.set('lang', lang);
  }
}

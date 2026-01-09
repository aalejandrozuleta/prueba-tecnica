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
   * @param context - Objeto con los datos del contexto a establecer.
   * @param callback - Función que se ejecutará dentro de ese contexto.
   * @returns El valor retornado por el callback.
   */
  static run<T>(context: RequestContextData, callback: (...args: unknown[]) => T): T {
    return storage.run(context, callback);
  }

  /**
   * Obtiene un valor del contexto actual usando la clave proporcionada.
   *
   * @param key - La clave del valor a obtener del contexto.
   * @returns El valor asociado a la clave, o `undefined` si no existe.
   */
  static get<T extends keyof RequestContextData>(key: T): RequestContextData[T] | undefined {
    return storage.getStore()?.[key];
  }

  /**
   * Obtiene el valor del idioma actual del contexto.
   *
   * @returns El idioma actual, o 'es' si no se ha definido.
   */
  static getLang(): string {
    return this.get('lang') ?? 'es'; // Valor por defecto
  }

  /**
   * Establece un valor en el contexto actual.
   *
   * @param key - Clave del dato a establecer.
   * @param value - Valor a establecer.
   */
  static set<T extends keyof RequestContextData>(key: T, value: RequestContextData[T]): void {
    const store = storage.getStore();
    if (store) {
      store[key] = value;
    }
  }

  /**
   * Establece el idioma actual en el contexto.
   *
   * @param lang - Código de idioma (por ejemplo, 'es', 'en').
   */
  static setLang(lang: string): void {
    this.set('lang', lang);
  }
}

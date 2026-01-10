import { I18nService } from 'nestjs-i18n';

/**
 * Traduce mensajes de validación serializados con `i18nValidationMessage`.
 *
 * @remarks
 * Esta función procesa mensajes de validación que pueden venir en formato
 * serializado (`clave|args`) y los traduce utilizando el servicio de
 * internacionalización de `nestjs-i18n`.
 *
 * Permite convertir mensajes técnicos generados por validaciones en
 * mensajes legibles y localizados para el cliente final.
 *
 * @param rawMessages
 * Arreglo de mensajes de validación sin traducir.
 *
 * @param i18n
 * Servicio de internacionalización utilizado para resolver las traducciones.
 *
 * @returns
 * Arreglo de mensajes de validación traducidos.
 */
export function translateValidationMessages(
  rawMessages: string[],
  i18n: I18nService,
): string[] {
  return rawMessages.map((raw) => {
    /**
     * Si el mensaje no está serializado, se retorna tal cual.
     */
    if (!raw.includes('|')) {
      return raw;
    }

    /**
     * Extrae la clave de traducción y los argumentos serializados.
     */
    const [key, args] = raw.split('|');

    let parsedArgs: Record<string, unknown> | undefined;

    /**
     * Intenta parsear los argumentos de traducción, si existen.
     */
    if (args) {
      try {
        const parsed = JSON.parse(args) as unknown;

        if (typeof parsed === 'object' && parsed !== null) {
          parsedArgs = parsed as Record<string, unknown>;
        }
      } catch {
        parsedArgs = undefined;
      }
    }

    /**
     * Traduce el mensaje utilizando la clave y los argumentos parseados.
     */
    return i18n.translate(key, parsedArgs);
  });
}

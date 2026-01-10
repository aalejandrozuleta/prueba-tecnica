import { I18nService } from 'nestjs-i18n';

/**
 * Traduce mensajes i18nValidationMessage serializados.
 */
export function translateValidationMessages(
  rawMessages: string[],
  i18n: I18nService,
): string[] {
  return rawMessages.map((raw) => {
    if (!raw.includes('|')) {
      return raw;
    }

    const [key, args] = raw.split('|');

    let parsedArgs: Record<string, unknown> | undefined;

    try {
      parsedArgs = args ? JSON.parse(args) : undefined;
    } catch {
      parsedArgs = undefined;
    }

    return i18n.translate(key, parsedArgs);
  });
}

import { SENSITIVE_FIELDS, SensitiveField } from '../constants/sensitive-fields.constant';

/**
 * Sanitiza un valor eliminando campos sensibles de forma recursiva.
 *
 * ⚠️ Advertencia:
 * - Esta función elimina propiedades dinámicamente.
 * - Por ello, el tipo de retorno es `unknown`.
 *
 * @param data Valor a sanitizar
 * @returns Valor sanitizado
 */
export function sanitize(data: unknown): unknown {
  if (Array.isArray(data)) {
    const sanitizedArray: unknown[] = [];

    for (const item of data) {
      if (isPlainObject(item)) {
        sanitizedArray.push(deepSanitize(item));
      } else {
        sanitizedArray.push(item);
      }
    }

    return sanitizedArray;
  }

  if (isPlainObject(data)) {
    return deepSanitize(data);
  }

  return data;
}

/**
 * Elimina campos sensibles de un objeto de forma recursiva.
 *
 * @param obj Objeto a sanitizar
 * @returns Objeto sanitizado sin campos sensibles
 */
function deepSanitize(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const entries = Object.entries(obj);

  for (const [key, value] of entries) {
    if (isSensitiveField(key)) {
      continue;
    }

    if (Array.isArray(value)) {
      const sanitizedArray: unknown[] = [];

      for (const item of value) {
        if (isPlainObject(item)) {
          sanitizedArray.push(deepSanitize(item));
        } else {
          sanitizedArray.push(item);
        }
      }

      // eslint-disable-next-line security/detect-object-injection
      result[key] = sanitizedArray;
    } else if (isPlainObject(value)) {
      // eslint-disable-next-line security/detect-object-injection
      result[key] = deepSanitize(value);
    } else {
      // eslint-disable-next-line security/detect-object-injection
      result[key] = value;
    }
  }

  return result;
}

/**
 * Determina si una clave corresponde a un campo sensible.
 *
 * @param key Clave a evaluar
 * @returns `true` si la clave es sensible
 */
function isSensitiveField(key: string): key is SensitiveField {
  return (SENSITIVE_FIELDS as readonly string[]).includes(key);
}

/**
 * Determina si un valor es un objeto plano.
 *
 * @param value Valor a evaluar
 * @returns `true` si es un objeto no nulo
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

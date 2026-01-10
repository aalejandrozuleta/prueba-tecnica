import { SENSITIVE_FIELDS } from '../constants/sensitive-fields.constant';

/**
 * Sanitiza uno o varios objetos eliminando campos sensibles de forma recursiva.
 *
 * @template T Tipo del objeto
 */
export function sanitize<T extends object>(data: T | T[]): T | T[] {
  if (Array.isArray(data)) {
    return data.map((item) => (isObject(item) ? deepSanitize(item) : item)) as T[];
  }

  return deepSanitize(data);
}

function deepSanitize<T extends object>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.includes(key as any)) {
      continue;
    }

    if (Array.isArray(value)) {
      result[key] = value.map((item) => (isObject(item) ? deepSanitize(item) : item));
    } else if (isObject(value)) {
      result[key] = deepSanitize(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

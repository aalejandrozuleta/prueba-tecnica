import { ZodType } from 'zod';

/**
 * Valida un campo individual usando Zod.
 *
 * @param schema Schema Zod del campo
 * @param value Valor a validar
 * @returns Key del error o null si es válido
 */
export function validateField(
  schema: ZodType<string>,
  value: string,
): string | null {
  const result = schema.safeParse(value);

  if (result.success) return null;

  return result.error.issues[0]?.message ?? null;
}

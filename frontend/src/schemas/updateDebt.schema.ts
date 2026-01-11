import { z } from 'zod';

/**
 * Schema de creación de deuda.
 *
 * Replica exactamente el backend (updateDebtDto),
 * usando CLAVES de i18n en los mensajes.
 */
export const updateDebtSchema = z.object({
  amount: z
    .number()
    .refine(v => !isNaN(v), {
      message: 'debtRequiredAmount',
    })
    .refine(v => v > 0, {
      message: 'debtPositiveAmount',
    })
    .refine(v => Number.isInteger(v * 100), {
      message: 'debtMaxDecimals',
    }),

  description: z
    .string()
    .max(255, {
      message: 'debtMaxDescription',
    })
    .optional(),

});

export type UpdateDebtSchema = z.infer<
  typeof updateDebtSchema
>;

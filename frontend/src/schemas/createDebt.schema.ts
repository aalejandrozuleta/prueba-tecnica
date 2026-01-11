import { z } from 'zod';

/**
 * Schema de creación de deuda.
 *
 * Replica exactamente el backend (CreateDebtDto),
 * usando CLAVES de i18n en los mensajes.
 */
export const createDebtSchema = z.object({
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

  creditorId: z
    .string()
    .refine(v => v.length > 0, {
      message: 'debtRequiredCreditorId',
    })
    .refine(
      v =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          v,
        ),
      {
        message: 'debtInvalidCreditorId',
      },
    ),

  status: z.literal('PENDING'),
});

export type CreateDebtSchema = z.infer<
  typeof createDebtSchema
>;

import { z } from 'zod';

/**
 * Regex de validación de contraseña.
 * Debe coincidir EXACTAMENTE con el backend.
 */
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/;

/**
 * Esquema de validación del formulario de registro.
 *
 * Este esquema replica exactamente las validaciones del backend
 * definidas en CreateUserDto.
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'required' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'invalid_email' },
      ),

    password: z
      .string()
      .regex(PASSWORD_REGEX, {
        message: 'passwordInvalid',
      }),

    confirmPassword: z.string(),

    name: z
      .string()
      .min(2, { message: 'nameMin' })
      .max(50, { message: 'nameMax' })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordMatch',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

import { z } from 'zod';

/**
 * Regex de validación de contraseña.
 * Debe coincidir EXACTAMENTE con el backend.
 */
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/;

/**
 * Esquema de validación del formulario de login.
 *
 * Este esquema replica exactamente las validaciones del backend
 */
export const loginSchema = z
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

    })


export type LoginSchema = z.infer<typeof loginSchema>;

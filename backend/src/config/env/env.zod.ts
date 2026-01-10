import { z } from 'zod';

/**
 * Esquema de variables de entorno.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),

  REDIS_URL: z.string(),
  DATABASE_URL: z.string(),
  MONGO_URI: z.string(),

  CORS_ORIGIN: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_EXPIRES_IN: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().default(30),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DATABASE: z.coerce.number().default(0),
});

export type EnvVars = z.infer<typeof envSchema>;

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida');
}

/**
 * Pool PostgreSQL
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Prisma Client (Prisma v7)
 */
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

/**
 * =========================
 * LIMPIEZA TOTAL
 * =========================
 */
async function cleanDatabase(): Promise<void> {
  console.log('🧹 Limpiando todas las tablas…');

  /**
   * ⚠️ IMPORTANTE:
   * Orden no importa porque usamos CASCADE
   * RESTART IDENTITY reinicia secuencias
   */
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "payment_history",
      "auth_sessions",
      "login_audit",
      "debts",
      "users"
    RESTART IDENTITY
    CASCADE;
  `);

  console.log('✅ Base de datos limpia');
}

/**
 * =========================
 * BOOTSTRAP
 * =========================
 */
cleanDatabase()
  .catch((err) => {
    console.error('❌ Error limpiando la base de datos:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

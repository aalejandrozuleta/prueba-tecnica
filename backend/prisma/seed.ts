import { PrismaClient, DebtStatus, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida');
}

/**
 * Pool nativo de pg
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Prisma Client con adapter (OBLIGATORIO en Prisma 7)
 */
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main(): Promise<void> {
  console.log('🌱 Ejecutando seed…');

  // ==========================
  // USERS
  // ==========================
  await prisma.user.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      email: `user${i + 1}@test.com`,
      password: `hashed-password-${i + 1}`,
      name: `Usuario ${i + 1}`,
      role: i === 0 ? UserRole.ADMIN : UserRole.USER,
      emailVerified: true,
    })),
    skipDuplicates: true,
  });

  const users = await prisma.user.findMany();

  // ==========================
  // DEBTS (100)
  // ==========================
  await prisma.debt.createMany({
    data: Array.from({ length: 100 }).map((_, i) => {
      const debtor = users[i % users.length];
      const creditor = users[(i + 1) % users.length];

      return {
        amount: (Math.random() * 900 + 100).toFixed(2),
        description: `Deuda ${i + 1}`,
        status: i % 3 === 0 ? DebtStatus.PAID : DebtStatus.PENDING,
        debtorId: debtor.id,
        creditorId: creditor.id,
        paidAt: i % 3 === 0 ? new Date() : null,
      };
    }),
  });

  console.log('✅ Seed completado correctamente');
}

main()
  .catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

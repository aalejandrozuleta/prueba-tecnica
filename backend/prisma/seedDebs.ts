import { PrismaClient, DebtStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * =========================
 * VALIDACIÓN INPUT
 * =========================
 */
const [, , userId, countArg] = process.argv;

if (!userId) {
  console.error('❌ Debes pasar el userId');
  console.error('Uso: pnpm ts-node prisma/seed-user-debts.ts <USER_ID> [CANTIDAD]');
  process.exit(1);
}

const DEBT_COUNT = Number(countArg) > 0 ? Number(countArg) : 10;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida');
}

/**
 * =========================
 * PRISMA CLIENT (v7)
 * =========================
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

/**
 * =========================
 * DATOS REALISTAS
 * =========================
 */
const DESCRIPTIONS = [
  'Préstamo personal',
  'Pago de arriendo',
  'Compra compartida',
  'Gastos médicos',
  'Viaje',
  'Cena grupal',
  'Pago de servicios',
  'Compra de equipo',
  'Adelanto de dinero',
  'Reparación del vehículo',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min = 50, max = 2500): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function randomPastDate(days = 90): Date {
  return new Date(Date.now() - Math.floor(Math.random() * days) * 86400000);
}

/**
 * =========================
 * MAIN
 * =========================
 */
async function main(): Promise<void> {
  console.log(`🌱 Creando ${DEBT_COUNT} deudas para el usuario ${userId}`);

  const debtor = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!debtor) {
    throw new Error(`❌ Usuario no encontrado: ${userId}`);
  }

  const creditors = await prisma.user.findMany({
    where: { id: { not: userId } },
  });

  if (creditors.length === 0) {
    throw new Error('❌ No hay usuarios disponibles como acreedores');
  }

  const debts = Array.from({ length: DEBT_COUNT }).map(() => {
    const creditor = randomItem(creditors);
    const isPaid = Math.random() < 0.3;
    const createdAt = randomPastDate(120);

    return {
      amount: randomAmount(),
      description: randomItem(DESCRIPTIONS),
      status: isPaid ? DebtStatus.PAID : DebtStatus.PENDING,
      debtorId: debtor.id,
      creditorId: creditor.id,
      createdAt,
      paidAt: isPaid ? randomPastDate(60) : null,
    };
  });

  await prisma.debt.createMany({
    data: debts,
  });

  console.log(`✅ ${DEBT_COUNT} deudas creadas correctamente`);
}

/**
 * =========================
 * BOOTSTRAP
 * =========================
 */
main()
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

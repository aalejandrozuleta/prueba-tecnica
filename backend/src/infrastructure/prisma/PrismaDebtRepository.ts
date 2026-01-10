import { Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { Debt } from '@auth/domain/entities/Debt.entity';
import { mapToDomain } from './mappers/debt.mapper';

@Injectable()
export class PrismaDebtRepository implements DebtRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las deudas de un deudor
   */
  async findByDebtorId(debtorId: string): Promise<boolean> {
    const records = await this.prisma.user.findMany({
      where: { id: debtorId },
    });

    return records.length > 0;
  }

  /**
   *
   * @param creditorId ID del acreedor
   * @returns true si existe al menos una deuda con ese acreedor
   */

  async findByCreditorId(creditorId: string): Promise<boolean> {
    const records = await this.prisma.user.findMany({
      where: { id: creditorId },
    });

    return records.length > 0;
  }

  /**
   * Cuenta las deudas activas de un deudor
   */
  async countActiveByDebtor(debtorId: string): Promise<number> {
    return this.prisma.debt.count({
      where: {
        debtorId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Crea una nueva deuda
   */
  async create(debt: Debt): Promise<Debt> {
    console.log('description', debt.getDescription());

    const record = await this.prisma.debt.create({
      data: {
        id: debt.getId(),
        amount: debt.getAmount(),
        description: debt.getDescription(),
        status: debt.getStatus(),
        debtorId: debt.getDebtorId(),
        creditorId: debt.getCreditorId(),
        createdAt: debt.getCreatedAt(),
        paidAt: debt.getPaidAt(),
      },
    });

    return mapToDomain(record);
  }
}

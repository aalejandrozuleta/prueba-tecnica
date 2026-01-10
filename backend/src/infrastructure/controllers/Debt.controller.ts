import { Body, Controller, Post } from '@nestjs/common';

import { CreateDebtDto } from '@auth/application/dto/CreateDebt.dto';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';

@Controller('debt')
export class DebtController {
  constructor(private readonly createDebtUseCase: CreateDebtUseCase) {}

  @Post('create')
  async create(@Body() dto: CreateDebtDto) {
    return this.createDebtUseCase.execute(dto);
  }
}

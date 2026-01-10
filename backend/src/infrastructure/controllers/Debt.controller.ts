import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { CreateDebtDto } from '@auth/application/dto/CreateDebt.dto';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';
import { GetDebtUseCase } from '@auth/application/use-cases/Debt/GetDebt.use-case';
import { JwtSessionGuard } from '../auth/guards/jwt-session.guard';
import { AuthUser } from '../auth/types/auth-user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateDebtUseCase } from '@auth/application/use-cases/Debt/UpdateDebt.use-case';
import { UpdateDebtDto } from '@auth/application/dto/UpdateDebt.dto';


@Controller('debt')
@UseGuards(JwtSessionGuard)
export class DebtController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly getDebtUseCase: GetDebtUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
  ) { }

  @Post('create')
  async create(
    @Body() dto: CreateDebtDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.createDebtUseCase.execute({
      ...dto,
      debtorId: user.id,
    });
  }

  @Get()
  async getMyDebts(@CurrentUser() user: AuthUser) {
    return this.getDebtUseCase.execute(user.id);
  }

  @Put()
  async updateDebt(@Body() dto: UpdateDebtDto) {
    return this.updateDebtUseCase.execute(dto);
  }
}

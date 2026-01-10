import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';

import { CreateDebtDto } from '@auth/application/dto/CreateDebt.dto';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';
import { GetDebtUseCase } from '@auth/application/use-cases/Debt/GetDebt.use-case';
import { JwtSessionGuard } from '../auth/guards/jwt-session.guard';
import { AuthUser } from '../auth/types/auth-user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateDebtUseCase } from '@auth/application/use-cases/Debt/UpdateDebt.use-case';
import { UpdateDebtDto } from '@auth/application/dto/UpdateDebt.dto';
import { DeleteDebtUseCase } from '@auth/application/use-cases/Debt/DeleteDebt.use-case';
import { DeleteDebtDto } from '@auth/application/dto/DeleteDebt.dto';
import { PayDebtUseCase } from '@auth/application/use-cases/Debt/PayDebt.use-case';

@Controller('debt')
@UseGuards(JwtSessionGuard)
export class DebtController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly getDebtUseCase: GetDebtUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
    private readonly deleteDebtUseCase: DeleteDebtUseCase,
    private readonly payDebtUseCase: PayDebtUseCase,

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
  async getMyDebts(@CurrentUser() user: AuthUser, @Query('page') page = '1',
    @Query('limit') limit = '10',) {
    return this.getDebtUseCase.execute(user.id,Number(page),
      Number(limit),);
  }

  @Put()
  async updateDebt(@Body() dto: UpdateDebtDto) {
    return this.updateDebtUseCase.execute(dto);
  }

  @Delete()
  async deleteDebt(@Body() dto: DeleteDebtDto) {
    return this.deleteDebtUseCase.execute(dto.id);
  }

  @Post('pay')
  async payDebt(@Body() dto: DeleteDebtDto) {
    return this.payDebtUseCase.execute(dto.id);
  }
}

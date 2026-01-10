import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { CreateDebtDto } from '@auth/application/dto/CreateDebt.dto';
import { DeleteDebtDto } from '@auth/application/dto/DeleteDebt.dto';
import { UpdateDebtDto } from '@auth/application/dto/UpdateDebt.dto';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';
import { DeleteDebtUseCase } from '@auth/application/use-cases/Debt/DeleteDebt.use-case';
import { GetDebtUseCase } from '@auth/application/use-cases/Debt/GetDebt.use-case';
import { PayDebtUseCase } from '@auth/application/use-cases/Debt/PayDebt.use-case';
import { UpdateDebtUseCase } from '@auth/application/use-cases/Debt/UpdateDebt.use-case';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtSessionGuard } from '../auth/guards/jwt-session.guard';
import { AuthUser } from '../auth/types/auth-user.type';
import { GetDebtsCountUseCase } from '@auth/application/use-cases/Debt/getDebtsCount.use-case';

@ApiTags('Debt')
@ApiBearerAuth()
@Controller('debt')
@UseGuards(JwtSessionGuard)
export class DebtController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly getDebtUseCase: GetDebtUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
    private readonly deleteDebtUseCase: DeleteDebtUseCase,
    private readonly payDebtUseCase: PayDebtUseCase,
    private readonly getDebtsCountUseCase: GetDebtsCountUseCase,
  ) {}

  @Post('create')
  @ApiOperation({
    summary: 'Crear una deuda',
    description: 'Crea una nueva deuda asociada al usuario autenticado como deudor.',
  })
  @ApiBody({ type: CreateDebtDto })
  @ApiResponse({ status: 201, description: 'Deuda creada correctamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o regla de negocio violada' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiConflictResponse({ description: 'Conflicto de negocio (límite, estado inválido, etc.)' })
  async create(@Body() dto: CreateDebtDto, @CurrentUser() user: AuthUser) {
    return this.createDebtUseCase.execute(
      {
        ...dto,
        debtorId: user.id,
      },
      user.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener mis deudas',
    description: 'Obtiene las deudas del usuario autenticado de forma paginada.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado paginado de deudas' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  async getMyDebts(
    @CurrentUser() user: AuthUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.getDebtUseCase.execute(user.id, Number(page), Number(limit));
  }

  @Put()
  @ApiOperation({
    summary: 'Actualizar una deuda',
    description: 'Actualiza el monto, estado o descripción de una deuda existente.',
  })
  @ApiBody({ type: UpdateDebtDto })
  @ApiResponse({ status: 200, description: 'Deuda actualizada correctamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiNotFoundResponse({ description: 'Deuda no encontrada' })
  @ApiConflictResponse({ description: 'La deuda ya fue pagada' })
  async updateDebt(@Body() dto: UpdateDebtDto, @CurrentUser() user: AuthUser) {
    return this.updateDebtUseCase.execute(dto, user.id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Eliminar una deuda',
    description: 'Elimina una deuda existente del usuario autenticado.',
  })
  @ApiBody({ type: DeleteDebtDto })
  @ApiResponse({ status: 200, description: 'Deuda eliminada correctamente' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiNotFoundResponse({ description: 'Deuda no encontrada' })
  async deleteDebt(@Body() dto: DeleteDebtDto, @CurrentUser() user: AuthUser) {
    return this.deleteDebtUseCase.execute(dto.id, user.id);
  }

  @Post('pay')
  @ApiOperation({
    summary: 'Pagar una deuda',
    description: 'Marca una deuda como pagada.',
  })
  @ApiBody({ type: DeleteDebtDto })
  @ApiResponse({ status: 200, description: 'Deuda pagada correctamente' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiNotFoundResponse({ description: 'Deuda no encontrada' })
  @ApiConflictResponse({ description: 'La deuda ya fue pagada' })
  async payDebt(@Body() dto: DeleteDebtDto, @CurrentUser() user: AuthUser) {
    return this.payDebtUseCase.execute(dto.id, user.id);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Obtener el número de deudas de un usuario',
    description: 'Obtiene el número de deudas de un usuario.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Número de deudas obtenido' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  async getDebtsCount(
    @CurrentUser() user: AuthUser,
  ){
    return this.getDebtsCountUseCase.execute(user.id);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { CreateUserDto } from '@auth/application/dto/CreateUser.dto';
import { CreateUserUseCase } from '@auth/application/use-cases/User/Create.use-case';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema utilizando credenciales válidas.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Datos necesarios para el registro del usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @ApiConflictResponse({
    description: 'El correo electrónico ya se encuentra registrado',
  })
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}

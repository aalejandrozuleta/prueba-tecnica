import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from '@auth/application/dto/CreateUser.dto';
import { CreateUserUseCase } from '@auth/application/use-cases/User/Create.use-case';

@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('register')
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}

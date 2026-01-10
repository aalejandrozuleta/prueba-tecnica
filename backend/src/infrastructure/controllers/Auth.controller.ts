import { Body, Controller, Ip, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginUserDto } from '@auth/application/dto/LoginUser.dto';
import { LoginUserUseCase } from '@auth/application/use-cases/User/Login.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica un usuario y genera una sesión válida. ' +
      'Los tokens se envían como cookies HTTP-only.',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'Credenciales del usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas o cuenta bloqueada',
  })
  async login(
    @Body() dto: LoginUserDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.loginUserUseCase.execute(dto, ip);

    // Access token (corto)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // true en prod
      sameSite: 'lax', // o 'lax'
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // Refresh token (largo)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    return {
      success: true,
    };
  }
}

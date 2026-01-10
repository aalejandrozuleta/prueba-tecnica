import { Body, Controller, Ip, Post, Res } from '@nestjs/common';
import { LoginUserDto } from '@auth/application/dto/LoginUser.dto';
import { LoginUserUseCase } from '@auth/application/use-cases/User/Login.use-case';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.loginUserUseCase.execute(dto, ip);

    // Access token (corto)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // true en prod
      sameSite: 'strict', // o 'lax'
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // Refresh token (largo)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    return {
      success: true,
    };
  }
}

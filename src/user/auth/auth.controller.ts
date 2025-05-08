import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginUserDto, @Res() res: Response) {
    const { data } = await this.authService.login(user);
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax', // Or 'none' if cross-site and using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Login successful',
      data,
    });
  }

  @Post('reset-password')
  async resetPassword(@Body() user: { token: string; password: string }) {
    return this.authService.resetPassword(user.token, user.password);
  }
}

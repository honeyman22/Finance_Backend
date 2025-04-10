import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { SigninUserDto } from './dtos/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginUserDto, @Res() res: Response) {
    const { data } = await this.authService.login(user);
    res.cookie('token', data.token, {
      httpOnly: true, // Prevents client-side JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });
    return res.json({
      message: 'Login successful',
      data,
    });
  }

  @Post('register')
  async register(@Body() user: SigninUserDto) {
    return this.authService.register(user);
  }
}

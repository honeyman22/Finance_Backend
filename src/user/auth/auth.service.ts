import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  async login(user: LoginUserDto) {
    const isUserExits = await this.databaseService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!isUserExits) throw new NotFoundException('User not found');

    const isPasswordMatch = await bcrypt.compare(
      user.password,
      isUserExits.password,
    );

    if (!isPasswordMatch) throw new BadRequestException('Password not match');

    const payload = {
      id: isUserExits.id,
      email: isUserExits.email,
      user_type: isUserExits.user_type,
    };

    const token = this.jwtService.sign(payload);

    await this.databaseService.user.update({
      where: {
        id: isUserExits.id,
      },
      data: {
        token: token,
      },
    });
    return {
      message: 'Login success',
      data: {
        token: token,
        role: isUserExits.user_type,
      },
    };
  }

  async resetPassword(token: string, password: string) {
    let payload;
    try {
      payload = this.jwtService.verify(token); // Verify signature and expiry
    } catch (error) {
      throw new UnauthorizedException(
        error.name === 'TokenExpiredError'
          ? 'Reset token has expired'
          : 'Invalid reset token',
      );
    }

    const user = await this.databaseService.user.findUnique({
      where: {
        id: payload['sub'],
      },
    });

    if (!user.isFirstTime) {
      throw new BadRequestException('You have already reset your password');
    }
    const newpayload = {
      sub: user.id,
      name: user.fullName,
      email: user.email,
    };
    const newtoken = this.jwtService.sign(newpayload);
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.databaseService.user.update({
      where: {
        id: payload['sub'],
      },
      data: {
        password: hashedPassword,
        token: newtoken,
        status: 'active',
        isFirstTime: false,
      },
    });
    return {
      message: 'Password reset successfully',
    };
  }
}

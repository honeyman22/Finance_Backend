import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dtos/login.dto';
import { SigninUserDto } from './dtos/signin.dto';
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
      },
    };
  }

  async register(user: SigninUserDto) {
    const isUserExits = await this.databaseService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (isUserExits) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await this.databaseService.user.create({
      data: {
        email: user.email,
        fullName: user.name,
        password: hashedPassword,
        phoneNumber: user.phoneNumber,
        user_type: user.user_type,
      },
    });

    const payload = {
      sub: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
    };
    const token = this.jwtService.sign(payload);
    const updatedUser = await this.databaseService.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        token: token,
      },
    });
    return {
      message: 'Register successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.fullName,
        email: updatedUser.email,
      },
    };
  }
}

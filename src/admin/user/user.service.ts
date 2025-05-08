import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dtos/create-user.dtos';
import { ExampleService } from 'src/emails/emails.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: ExampleService,
    private readonly jwtService: JwtService,
  ) {}

  //Get all users

  async getAllUsers() {
    // Logic to fetch all users from the database
    const users = await this.databaseService.user.findMany({
      where: {
        user_type: 'user',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
        phoneNumber: true,
        activationDate: true,
        status: true,
        Deposit: {
          where: { isPaid: true },
          select: {
            amount: true,
          },
        },
        Loan: {
          where: { status: 'approved' },
          select: {
            amount: true,
          },
        },
      },
    });
    return {
      message: 'Users fetched successfully',
      data: users,
    };
  }

  async createUser(user: CreateUserDto) {
    const isEmailexists = await this.databaseService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const isPhoneExists = await this.databaseService.user.findUnique({
      where: {
        phoneNumber: user.phoneNumber,
      },
    });

    if (isEmailexists) throw new BadRequestException('Email already exists.');
    if (isPhoneExists)
      throw new BadRequestException('Phone number already exists.');
    const ISoFarmat = new Date(user.activationDate);
    const newUser = await this.databaseService.user.create({
      data: {
        email: user.email,
        fullName: user.name,
        password: user.password,
        phoneNumber: user.phoneNumber,
        activationDate: ISoFarmat,
      },
    });
    const payload = {
      sub: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });
    await this.databaseService.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        token: token,
      },
    });
    await this.mailService.sendWelcomeEmail({
      name: user.name,
      resetPasswordUrl: `http://localhost:5173/reset-password?token=${token}`,
      phone: user.phoneNumber,
      email: user.email,
    });
    return {
      message: 'User created successfully',
      data: newUser,
    };
  }
}

// Return a success message and the newly created user's data

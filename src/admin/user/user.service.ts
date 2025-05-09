import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dtos/create-user.dtos';
import { ExampleService } from 'src/emails/emails.service';
import { JwtService } from '@nestjs/jwt';
import { getPaginationParams } from 'src/utils/pagination';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: ExampleService,
    private readonly jwtService: JwtService,
  ) {}

  //Get all users

  async getAllUsers(page: number, limit: number) {
    const users = await this.databaseService.user.findMany({
      where: {
        user_type: 'user',
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
        phoneNumber: true,
        activationDate: true,
        status: true,
        deposit: {
          where: { isPaid: true },
          select: { amount: true },
        },
        loan: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const formattedUsers = users.map((user) => {
      const totalDepositAmount = user.deposit.reduce(
        (sum, d) => sum + d.amount,
        0,
      );
      const paidDepositCount = user.deposit.length;
      const totalLoanAmount = user.loan[0]?.amount || 0;
      const loanStatus = user.loan[0]?.status || null;

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        image: user.image,
        phoneNumber: user.phoneNumber,
        status: user.status,
        activationDate: user.activationDate,
        depositAmount: totalDepositAmount,
        depositDuration: paidDepositCount + ' months',
        loanAmount: totalLoanAmount,
        loanStatus: loanStatus,
      };
    });

    return {
      message: 'Users fetched successfully',
      pagination: getPaginationParams(page, limit, users.length),
      data: formattedUsers,
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
        password: 'Hello@123',
        phoneNumber: user.phoneNumber,
        activationDate: ISoFarmat,
        isFirstTime: true,
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

  async deactivateUser(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new BadRequestException('User not found');
    const updatedUser = await this.databaseService.user.update({
      where: {
        id: id,
      },
      data: {
        status: 'deactivate',
      },
    });
    return {
      message: 'User deactivated successfully',
      data: updatedUser,
    };
  }
}

// Return a success message and the newly created user's data

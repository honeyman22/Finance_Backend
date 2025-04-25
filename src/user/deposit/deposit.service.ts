import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getPaginationParams } from 'src/utils/pagination';
import { DepositDto } from './dtos/create.dto';

@Injectable()
export class DepositService {
  constructor(private readonly databaseService: DatabaseService) {}

  async backfillPayments() {
    const users = await this.databaseService.user.findMany();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (const user of users) {
      const date = new Date(user.createdAt);
      date.setDate(1); // normalize to the 1st of the month

      while (
        date.getFullYear() < currentYear ||
        (date.getFullYear() === currentYear &&
          date.getMonth() + 1 <= currentMonth)
      ) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const existing = await this.databaseService.deposit.findFirst({
          where: {
            userId: user.id,
            year,
            month,
          },
        });

        if (!existing) {
          await this.databaseService.deposit.create({
            data: {
              userId: user.id,
              amount: 1000,
              depositDate: new Date(year, month - 1, 1),
              year,
              month,
              fine: 0,
              isPaid: false,
            },
          });
        }

        // Move to next month
        date.setMonth(date.getMonth() + 1);
      }
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async createMonthlyPayments() {
    const users = await this.databaseService.user.findMany();

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    for (const user of users) {
      await this.databaseService.deposit.create({
        data: {
          userId: user.id,
          amount: 1000,
          depositDate: new Date(year, month - 1, 1), // 1st of the month
          month,
          year,
        },
      });
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyFines() {
    const today = new Date();

    const unpaidPayments = await this.databaseService.deposit.findMany({
      where: {
        isPaid: false,
        depositDate: {
          lt: today,
        },
      },
    });

    for (const payment of unpaidPayments) {
      const daysLate = Math.floor(
        (today.getTime() - payment.depositDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const newFine = daysLate * 10;

      await this.databaseService.deposit.update({
        where: { id: payment.id },
        data: {
          fine: newFine,
        },
      });
    }
  }

  async userDepositUpdate(depositId: string, depositDto: DepositDto) {
    const deposits = await this.databaseService.deposit.findUnique({
      where: {
        id: depositId,
      },
    });

    if (!deposits) {
      throw new Error(
        'No deposits found for this user in the specified month and year',
      );
    }

    const updateDeposit = this.databaseService.deposit.update({
      where: {
        id: deposits.id,
      },
      data: {
        isPaid: true,
        status: 'paid',
        paymentMethod: depositDto.paymentMethod,
      },
    });
    return {
      message: 'Deposit updated successfully',
      data: updateDeposit,
    };
  }

  async adminDepositUpdate(
    userId: string,
    status: 'pending' | 'approved' | 'rejected',
    depositId: string,
  ) {
    const deposits = await this.databaseService.deposit.findUnique({
      where: {
        id: depositId,
      },
    });
    if (!deposits) {
      throw new Error('No deposits found for this user');
    }
    const updateDeposit = this.databaseService.deposit.update({
      where: {
        id: deposits.id,
      },
      data: {
        status: status,
        depositDate: new Date(),
      },
    });
    return updateDeposit;
  }

  async getAllDeposits(page: number, limit: number, userId: string) {
    const deposits = await this.databaseService.deposit.findMany({
      where: {
        userId: userId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        depositDate: 'desc',
      },
      select: {
        id: true,
        amount: true,
        depositDate: true,
        paymentMethod: true,
        fine: true,
        status: true,
        receipt: true,
        isPaid: true,
      },
    });
    return {
      message: 'Deposits fetched successfully',
      pagination: getPaginationParams(page, limit, deposits.length),
      data: deposits,
    }; // Adjust the where clause as needed
  }

  async getDepositSummary(userId: string) {
    const deposits = await this.databaseService.deposit.findMany({
      where: {
        userId: userId,
        isPaid: true,
        status: 'approved',
      },
      select: {
        amount: true,
        depositDate: true,
        fine: true,
        year: true,
        month: true,
      },
    });

    const totalDeposits = deposits.reduce(
      (acc, deposit) => acc + deposit.amount,
      0,
    );
    const totalFines = deposits.reduce((acc, deposit) => acc + deposit.fine, 0);
    const numberOfDeposits = deposits.length;
    const thisYearDeposits = deposits
      .filter((deposit) => deposit.year === new Date().getFullYear())
      .map((deposit) => deposit.month);
    return {
      message: 'Deposit summary fetched successfully',
      data: {
        totalDeposits,
        totalFines,
        numberOfDeposits,
        thisYearDeposits,
      },
    };
  }
}

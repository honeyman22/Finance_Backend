import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DashboardService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getDashboardData() {
    const totalDeposit = await this.databaseService.deposit.aggregate({
      _sum: {
        amount: true,
        fine: true,
      },
      where: {
        isPaid: true,
      },
    });

    const TotalApprovedLoan = await this.databaseService.loan.aggregate({
      _sum: {
        amount: true,
        totalFine: true,
        totalInterest: true,
      },
      where: {
        status: 'approved',
      },
    });
    return {
      message: 'Dashboard data retrieved successfully',
      data: {
        totalDeposit: totalDeposit._sum.amount,
        totalApprovedLoan: TotalApprovedLoan._sum.amount,
        totalFine: totalDeposit._sum.fine + TotalApprovedLoan._sum.totalFine,
        totalInterest: TotalApprovedLoan._sum.totalInterest,
      },
    };
  }
}

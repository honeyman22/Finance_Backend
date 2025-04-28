import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLoanDto } from './dtos/createloan.dto';

@Injectable()
export class LoanService {
  constructor(private readonly databaseService: DatabaseService) {}

  async applyForLoan(userId: string, createLoanDto: CreateLoanDto) {
    // Logic to apply for a loan
    const createloan = await this.databaseService.loan.create({
      data: {
        userId,
        amount: createLoanDto.amount,
        loanDuration: createLoanDto.loanDuration,
        status: 'pending',
      },
    });
    const loan = await this.databaseService.loan.findFirst({
      where: {
        id: createloan.id,
      },
      select: {
        id: true,
        amount: true,
        loanDuration: true,
        repaymentFrequency: true,
        status: true,
      },
    });
    return {
      message: 'Loan application submitted successfully',
      loan,
    };
  }
}

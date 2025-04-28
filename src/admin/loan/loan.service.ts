import { HttpException, Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LoanService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async approveRejectLoan(id: string, status: 'approved' | 'rejected') {
    const loanExists = await this.dataBaseService.loan.findUnique({
      where: { id },
    });
    if (!loanExists) {
      throw new HttpException(`Loan  does not exist`, 404);
    }
    const loanExistsWithStatus = await this.dataBaseService.loan.findUnique({
      where: { id, status: 'pending' },
      select: { status: true },
    });
    if (!loanExistsWithStatus) {
      throw new HttpException(`Loan status is not pending`, 404);
    }
    const loan = await this.dataBaseService.loan.update({
      where: { id },
      data: { status },
    });
    const loanApprovedDate = new Date();
    const result = [];
    for (let i = 0; i < loanExists.loanDuration; i++) {
      const paymentDate = new Date(loanApprovedDate);
      paymentDate.setMonth(paymentDate.getMonth() + i + 1); // Add 1 month for each iteration
      result.push(paymentDate);
    }

    const loanWithInterest = loanExists.amount * (1 + 0.2);

    if (loan.status === 'approved') {
      for (const paymentDate of result) {
        await this.dataBaseService.loanPayment.create({
          data: {
            loanId: loan.id,
            amount: loanWithInterest / loanExists.loanDuration,
            paymentDate: paymentDate,
            isPaid: false,
          },
        });
      }
    }
    return {
      message: `Loan ${status} successfully`,
      loan: {
        ...loan,
        paymentDates: result,
        loanWithInterest,
      },
    };
  }
}

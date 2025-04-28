import { Body, Controller, Param, Put } from '@nestjs/common';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Put(':id')
  async approveLoan(@Param('id') id: string, @Body('status') status: string) {
    return this.loanService.approveRejectLoan(
      id,
      status as 'approved' | 'rejected',
    );
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { CreateLoanDto } from './dtos/createloan.dto';

@UseGuards(AuthGuard)
@Controller('loan')
export class LoanController {
  constructor(private readonly LoanService: LoanService) {}

  @Post('apply')
  async applyForLoan(
    @GetUser('id') userId: string,
    @Body() createLoanDto: CreateLoanDto,
  ) {
    return await this.LoanService.applyForLoan(userId, createLoanDto);
  }
}

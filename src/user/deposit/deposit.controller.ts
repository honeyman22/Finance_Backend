import { Controller, Post } from '@nestjs/common';
import { DepositService } from './deposit.service';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('backfill')
  async backfillPayments() {
    return this.depositService.backfillPayments();
  }

  // Define your endpoints here
}

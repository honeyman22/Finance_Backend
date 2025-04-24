import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { GetUser } from 'src/global/decorators/get-user.decorator';

@UseGuards(AuthGuard)
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('backfill')
  async backfillPayments() {
    return this.depositService.backfillPayments();
  }

  @Get()
  async getAllDeposits(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.depositService.getAllDeposits(page, limit, userId);
  }

  @Get('/summary')
  async getDepositSummary(@GetUser('id') userId: string) {
    return this.depositService.getDepositSummary(userId);
  }
  // Define your endpoints here
}

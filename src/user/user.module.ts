import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DepositModule } from './deposit/deposit.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [AuthModule, DepositModule, LoanModule],
})
export class UserModule {}

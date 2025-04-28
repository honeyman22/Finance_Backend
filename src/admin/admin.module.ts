import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [AdminUserModule, DatabaseModule, LoanModule],
})
export class AdminModule {}

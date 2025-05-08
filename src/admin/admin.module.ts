import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { LoanModule } from './loan/loan.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExampleModule } from 'src/emails/example.module';

@Module({
  imports: [
    AdminUserModule,
    DatabaseModule,
    LoanModule,
    DashboardModule,
    ExampleModule,
  ],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}

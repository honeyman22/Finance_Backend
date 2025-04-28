import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}

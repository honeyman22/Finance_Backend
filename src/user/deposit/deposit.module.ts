import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}

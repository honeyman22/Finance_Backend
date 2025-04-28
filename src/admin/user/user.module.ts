import { Module } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [AdminUserService],
})
export class AdminUserModule {}

import { Module } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ExampleModule } from 'src/emails/example.module';
import { ExampleService } from 'src/emails/emails.service';

@Module({
  imports: [DatabaseModule, ExampleModule],
  controllers: [UserController],
  providers: [AdminUserService, ExampleService],
})
export class AdminUserModule {}

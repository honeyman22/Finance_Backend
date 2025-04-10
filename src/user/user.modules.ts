import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [AuthModule, HomeModule, BookingModule],
})
export class UserModule {}

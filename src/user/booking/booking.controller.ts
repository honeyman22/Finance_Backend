import { Controller, Get, Query } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  getHomeData(@Query('filter') filter: 'upcoming' | 'completed' | 'cancelled') {
    return this.bookingService.getBookingData(filter);
  }
}

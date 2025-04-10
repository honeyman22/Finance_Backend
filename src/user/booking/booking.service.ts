import { Injectable } from '@nestjs/common';
import { bookingdata } from 'src/utils/bookingdata';

@Injectable()
export class BookingService {
  async getBookingData(filter: 'upcoming' | 'completed' | 'cancelled') {
    return bookingdata.filter((data) => data.status === filter);
  }
}

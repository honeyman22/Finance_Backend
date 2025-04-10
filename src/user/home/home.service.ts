import { Injectable } from '@nestjs/common';
import { homedate } from 'src/utils/homedata';

@Injectable()
export class HomeService {
  getHomeData() {
    return homedate;
  }
}

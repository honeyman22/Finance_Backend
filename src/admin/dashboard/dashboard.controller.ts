import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashBoardService: DashboardService) {}

  @Get()
  async getDashboardData() {
    return await this.dashBoardService.getDashboardData();
  }
}

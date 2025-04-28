import { Controller, Get } from '@nestjs/common';
import { AdminUserService } from './user.service';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: AdminUserService) {}

  @Get('all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dtos';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: AdminUserService) {}

  @Get('all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }
}

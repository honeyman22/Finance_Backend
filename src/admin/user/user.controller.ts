import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dtos';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: AdminUserService) {}

  @Get('all')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.userService.getAllUsers(page, limit);
  }
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }
  @Put('deactivate/:id')
  async deactivateUser(@Param('id') id: string) {
    return await this.userService.deactivateUser(id);
  }
}

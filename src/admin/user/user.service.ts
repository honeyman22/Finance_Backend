import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminUserService {
  constructor(private readonly databaseService: DatabaseService) {}

  //Get all users

  async getAllUsers() {
    // Logic to fetch all users from the database
    const users = await this.databaseService.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      message: 'Users fetched successfully',
      data: users,
    };
  }
}

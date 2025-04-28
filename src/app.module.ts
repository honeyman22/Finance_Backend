import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AdminModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

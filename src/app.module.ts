import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ExampleModule } from './emails/example.module';
import * as path from 'path';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: 465, // Use 465 for secure connections or 587 for STARTTLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        secure: true, // Set to false if using STARTTLS
      },
      defaults: {
        from: '"No Reply" <' + process.env.SMTP_FROM + '>',
      },
      template: {
        dir: path.join(__dirname, '..', 'templates'),
        adapter: new PugAdapter({
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    }),
    DatabaseModule,
    UserModule,
    AdminModule,
    ExampleModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

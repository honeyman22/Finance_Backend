import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ExampleService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDepositReminderEmail() {
    try {
      await this.mailerService.sendMail({
        to: 'cahamaw180@astimei.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Welcome to Our Platform! 🎉',
        template: './welcome', // relative to 'templates' folder, no extension
        context: {
          name: 'John Doe', // will replace #{name} in welcome.pug
        },
      });
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error; // Optionally rethrow the error
    }
  }

  public async example() {
    try {
      await this.mailerService.sendMail({
        to: 'cahamaw180@astimei.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'December Deposit Reminder! 💰',
        template: './welcome', // relative to 'templates' folder, no extension
        context: {
          context: {
            name: 'Nishan Bhattarai',
            month: 'December',
            email: process.env.EMAIL,
            phone: process.env.PHONE,
            websiteUrl: process.env.WEBSITE_URL,
          }, // will replace #{name} in welcome.pug
        },
      });
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error; // Optionally rethrow the error
    }
  }
}

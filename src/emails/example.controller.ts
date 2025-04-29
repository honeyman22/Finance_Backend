import { Controller, Post } from '@nestjs/common';
import { ExampleService } from './emails.service';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}
  @Post('send-mail')
  async sendMail() {
    try {
      await this.exampleService.example();
      return 'Mail sent!';
    } catch (error) {
      console.error('Error in sendMail:', error);
      return 'Failed to send mail.';
    }
  }
}

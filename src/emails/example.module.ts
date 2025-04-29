import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './emails.service';

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}

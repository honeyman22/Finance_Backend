import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global/global-exception-filter';
import { CustomZodValidationPipe } from './global/pipes/zod.validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // app.enableCors({
  //   origin: 'http://localhost:5173/', // Change this to your frontend URL if needed
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  //   credentials: true,
  // });
  app.useGlobalPipes(new CustomZodValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix(process.env.BASE_URL ?? 'api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

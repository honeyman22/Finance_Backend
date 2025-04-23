import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global/global-exception-filter';
import { CustomZodValidationPipe } from './global/pipes/zod.validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'https://finance-management-system-nine.vercel.app/', // Change this to your frontend URL if needed
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalPipes(new CustomZodValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix(process.env.BASE_URL ?? 'api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

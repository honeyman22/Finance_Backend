import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const loginUserSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .min(5, 'Email must be at least 5 characters long')
      .max(255, 'Email must be less than 255 characters')
      .email('Invalid email format')
      .transform((value) => value.toLowerCase()),

    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password must be less than 64 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
  })
  .strict();

export class LoginUserDto extends createZodDto(loginUserSchema) {}

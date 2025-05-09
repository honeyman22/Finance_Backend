import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const createUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .min(5, 'Email must be at least 5 characters long')
      .max(255, 'Email must be less than 255 characters')
      .email('Invalid email format')
      .transform((value) => value.toLowerCase()),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .trim(),
    activationDate: z.string({ required_error: 'Activation date is required' }),
  })
  .strict();
export class CreateUserDto extends createZodDto(createUserSchema) {}

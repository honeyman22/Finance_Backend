import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userDepositSchema = z
  .object({
    paymentMethod: z.enum(['bank_transfer', 'esewa'], {
      required_error: 'Payment method is required',
    }),
  })
  .strict();

export class DepositDto extends createZodDto(userDepositSchema) {}

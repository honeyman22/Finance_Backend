import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createLoanSchema = z
  .object({
    amount: z
      .number()
      .positive('Amount must be a positive number')
      .max(1000000, 'Amount exceeds maximum limit'),
    repaymentFrequency: z.enum(['weekly', 'bi-weekly', 'monthly'], {
      errorMap: () => ({ message: 'Invalid repayment frequency' }),
    }),
    loanDuration: z
      .number()
      .positive('Loan duration must be a positive number')
      .max(60, 'Loan duration exceeds maximum limit'),
  })
  .strict();

export class CreateLoanDto extends createZodDto(createLoanSchema) {}

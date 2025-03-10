import { z, ZodType } from "zod";

export class TransactionValidation {
  static readonly CREATE: ZodType = z.object({
    username: z.string().min(1).max(255),
    amount: z.number().positive(),
    paymentMethod: z.string().optional(),
    payer: z.string().min(1).max(255),
    payee: z.string().min(1).max(20),
    description: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    amount: z.number().positive().optional(),
    paymentMethod: z.string().optional(),
    payer: z.string().optional(),
    payee: z.string().optional(),
    description: z.string().optional(),
    success: z.boolean().optional(),
  });
}

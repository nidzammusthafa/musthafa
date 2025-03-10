import { z, ZodType } from "zod";

export class UserValidation {
  static readonly ADMIN: ZodType = z.object({
    name: z.string().min(1).max(100),
    username: z.string().min(1).max(100),
    email: z.string().min(1).max(255),
    phone: z.string().min(1).max(20),
  });

  static readonly UPDATEADMIN: ZodType = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  });

  static readonly MEMBER: ZodType = z.object({
    name: z.string().min(1).max(100),
    username: z.string().min(1).max(100),
    email: z.string().email().min(1).max(255),
    phone: z.string().min(1).max(20),
  });

  static readonly UPDATEMEMBER: ZodType = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  });
}

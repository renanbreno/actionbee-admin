import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["CASH", "BANK"], { message: "Tipo é obrigatório" }),
  initialBalance: z.string().optional(),
  bankName: z.string().optional(),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  bankName: z.string().optional(),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
  active: z.boolean().optional(),
});

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;
export type UpdateAccountFormValues = z.infer<typeof updateAccountSchema>;

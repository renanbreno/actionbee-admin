import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], { required_error: "Tipo é obrigatório" }),
  amount: z.string().min(1, "Valor é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  accountId: z.string().min(1, "Conta é obrigatória"),
  categoryId: z.string().optional(),
});

export const createTransferSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  sourceAccountId: z.string().min(1, "Conta de origem é obrigatória"),
  destinationAccountId: z.string().min(1, "Conta de destino é obrigatória"),
}).refine((d) => d.sourceAccountId !== d.destinationAccountId, {
  message: "Conta de origem e destino não podem ser iguais",
  path: ["destinationAccountId"],
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;
export type CreateTransferFormValues = z.infer<typeof createTransferSchema>;

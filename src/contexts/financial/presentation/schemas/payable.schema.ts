import { z } from "zod";

export const createPayableSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
  dueDate: z.string().min(1, "Vencimento é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  accountId: z.string().optional(),
  supplierId: z.string().optional(),
  notes: z.string().optional(),
});

export const payPayableSchema = z.object({
  paidAt: z.string().min(1, "Data de pagamento é obrigatória"),
  paidAmount: z.string().min(1, "Valor pago é obrigatório"),
  accountId: z.string().optional(),
});

export const batchPayPayableSchema = z.object({
  paidAt: z.string().min(1, "Data de pagamento é obrigatória"),
  accountId: z.string().optional(),
});

export type CreatePayableFormValues = z.infer<typeof createPayableSchema>;
export type PayPayableFormValues = z.infer<typeof payPayableSchema>;
export type BatchPayPayableFormValues = z.infer<typeof batchPayPayableSchema>;

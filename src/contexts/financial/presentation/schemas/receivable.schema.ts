import { z } from "zod";

export const createReceivableSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
  dueDate: z.string().min(1, "Vencimento é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  accountId: z.string().optional(),
  notes: z.string().optional(),
});

export const payReceivableSchema = z.object({
  paidAt: z.string().min(1, "Data de pagamento é obrigatória"),
  paidAmount: z.string().min(1, "Valor pago é obrigatório"),
  accountId: z.string().optional(),
});

export const batchPayReceivableSchema = z.object({
  paidAt: z.string().min(1, "Data de recebimento é obrigatória"),
  accountId: z.string().optional(),
});

export type CreateReceivableFormValues = z.infer<typeof createReceivableSchema>;
export type PayReceivableFormValues = z.infer<typeof payReceivableSchema>;
export type BatchPayReceivableFormValues = z.infer<typeof batchPayReceivableSchema>;

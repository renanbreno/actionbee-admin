import { z } from "zod";
import { validateDate } from "@/shared/utils/validations";

export const stockEntrySchema = z.object({
  batchNumber: z.string().min(1, "Número do lote obrigatório"),
  expiryDate: z
    .string()
    .min(1, "Data de validade obrigatória")
    .refine(validateDate, { message: "Data inválida. Use o formato dd/mm/aaaa" }),
  manufacturingDate: z
    .string()
    .optional()
    .refine((v) => !v || validateDate(v), { message: "Data inválida. Use o formato dd/mm/aaaa" }),
  quantity: z
    .number()
    .int("Quantidade deve ser inteira")
    .min(1, "Quantidade mínima é 1"),
});

export type StockEntryFormValues = z.infer<typeof stockEntrySchema>;

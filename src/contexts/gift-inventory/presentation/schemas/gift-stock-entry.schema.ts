import { z } from "zod";

export const giftStockEntrySchema = z.object({
  quantity: z.number().int("Quantidade deve ser inteira").min(1, "Quantidade mínima é 1"),
  reason: z.string().optional(),
});

export type GiftStockEntryFormValues = z.infer<typeof giftStockEntrySchema>;

import { z } from "zod";

export const giftStockAdjustmentSchema = z.object({
  operation: z.enum(["add", "remove"]),
  quantity: z.number().int("Quantidade deve ser inteira").min(1, "Quantidade mínima é 1"),
  reason: z.string().optional(),
});

export type GiftStockAdjustmentFormValues = z.infer<typeof giftStockAdjustmentSchema>;

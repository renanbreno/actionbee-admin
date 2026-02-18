import { z } from "zod";

export const createGiftTierSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional(),
  imageUrl: z
    .string()
    .url()
    .optional(),
  minOrderValue: z
    .number({ message: "Informe o valor mínimo do pedido" })
    .min(0.01, "O valor mínimo deve ser maior que zero"),
  productId: z.string().optional(),
});

export const updateGiftTierSchema = createGiftTierSchema;

export type CreateGiftTierFormValues = z.infer<typeof createGiftTierSchema>;
export type UpdateGiftTierFormValues = z.infer<typeof updateGiftTierSchema>;

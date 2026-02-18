import { z } from "zod";

export const createAffiliateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.trim() ? v : undefined)),
});

export type CreateAffiliateCategoryDTO = z.infer<typeof createAffiliateCategorySchema>;

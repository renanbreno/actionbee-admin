import { z } from "zod";

export const updateAffiliateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .optional(),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .nullable()
    .optional(),
});

export type UpdateAffiliateCategoryDTO = z.infer<typeof updateAffiliateCategorySchema>;

import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().optional(),
  isFoodProduct: z.boolean().optional(),
  parentId: z.string().optional().or(z.literal("")),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

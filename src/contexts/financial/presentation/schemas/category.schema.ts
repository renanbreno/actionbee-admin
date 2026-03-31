import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE"], { required_error: "Tipo é obrigatório" }),
  color: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;

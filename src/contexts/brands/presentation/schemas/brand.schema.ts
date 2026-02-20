import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export const updateBrandSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  isActive: z.boolean(),
});

export type CreateBrandFormValues = z.infer<typeof createBrandSchema>;
export type UpdateBrandFormValues = z.infer<typeof updateBrandSchema>;

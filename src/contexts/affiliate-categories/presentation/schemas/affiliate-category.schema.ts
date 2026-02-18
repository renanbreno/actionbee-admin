import { z } from "zod";

export const createAffiliateCategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional(),
});

export type AffiliateCategoryFormValues = z.infer<typeof createAffiliateCategoryFormSchema>;
export type AffiliateCategoryFormInput = z.input<typeof createAffiliateCategoryFormSchema>;

import { z } from "zod";

export const productGroupSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  productIds: z.array(z.string()).min(2, "Selecione pelo menos 2 produtos"),
});

export type ProductGroupFormValues = z.infer<typeof productGroupSchema>;

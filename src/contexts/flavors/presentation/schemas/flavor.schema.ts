import { z } from "zod";

export const createFlavorSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve ser um hex válido (ex: #E74C3C)")
    .optional()
    .or(z.literal("")),
});

export const updateFlavorSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve ser um hex válido (ex: #E74C3C)")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export type CreateFlavorFormValues = z.infer<typeof createFlavorSchema>;
export type UpdateFlavorFormValues = z.infer<typeof updateFlavorSchema>;

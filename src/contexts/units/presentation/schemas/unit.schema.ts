import { z } from "zod";

export const createUnitSchema = z.object({
  acronym: z
    .string()
    .min(2, "A sigla deve ter pelo menos 2 caracteres")
    .max(10, "A sigla deve ter no máximo 10 caracteres")
    .toUpperCase(),
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export const updateUnitSchema = z.object({
  acronym: z
    .string()
    .min(2, "A sigla deve ter pelo menos 2 caracteres")
    .max(10, "A sigla deve ter no máximo 10 caracteres")
    .toUpperCase()
    .optional(),
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateUnitFormValues = z.infer<typeof createUnitSchema>;
export type UpdateUnitFormValues = z.infer<typeof updateUnitSchema>;

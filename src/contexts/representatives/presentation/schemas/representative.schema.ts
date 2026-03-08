import { z } from "zod";

const emailValidator = z
  .string()
  .min(1, "O e-mail é obrigatório")
  .email("Informe um e-mail válido");

const documentRefinement = (value: string | undefined) => {
  if (!value) return false; // required
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 || digits.length === 14;
};

const baseRepresentativeSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: emailValidator,
  phone: z.string().min(1, "O telefone é obrigatório"),
  document: z
    .string()
    .min(1, "O CPF ou CNPJ é obrigatório")
    .refine(documentRefinement, { message: "Informe CPF (11 dígitos) ou CNPJ (14 dígitos) completo" }),
});

export const createRepresentativeSchema = baseRepresentativeSchema;

export const updateRepresentativeSchema = baseRepresentativeSchema
  .extend({
    phone: z.string().optional(),
  })
  .partial();

export type CreateRepresentativeFormValues = z.infer<typeof createRepresentativeSchema>;
export type UpdateRepresentativeFormValues = z.infer<typeof updateRepresentativeSchema>;

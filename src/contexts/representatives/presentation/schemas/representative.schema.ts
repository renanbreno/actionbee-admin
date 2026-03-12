import { z } from "zod";
import { validateDocument, validateEmail } from "@/shared/utils/validations";

const emailValidator = z
  .string()
  .min(1, "O e-mail é obrigatório")
  .refine(validateEmail, { message: "Informe um e-mail válido" });

// Validador de email opcional - valida apenas se houver valor
const optionalEmailValidator = z
  .string()
  .optional()
  .refine((val) => !val || validateEmail(val), {
    message: "Informe um e-mail válido",
  });

const documentRefinement = (value: string | undefined) => {
  if (!value) return true; // optional
  const cleaned = value.replace(/\D/g, "");
  // Apenas valida se o documento completo for válido
  if (cleaned.length === 11 || cleaned.length === 14) {
    return validateDocument(value);
  }
  return true; // Não rejeitar se estiver incompleto
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
    .refine(documentRefinement, { message: "CPF ou CNPJ inválido" }),
  commissionRate: z
    .number()
    .min(0, "A taxa de comissão não pode ser negativa")
    .max(100, "A taxa de comissão não pode ser maior que 100")
    .optional(),
});

export const createRepresentativeSchema = baseRepresentativeSchema;

// Schema de atualização - campos específicos com validação adequada
export const updateRepresentativeSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .optional(),
  email: optionalEmailValidator,
  phone: z.string().min(1, "O telefone é obrigatório").optional(),
  document: z
    .string()
    .min(1, "O CPF ou CNPJ é obrigatório")
    .refine(documentRefinement, { message: "CPF ou CNPJ inválido" })
    .optional(),
  commissionRate: z
    .number()
    .min(0, "A taxa de comissão não pode ser negativa")
    .max(100, "A taxa de comissão não pode ser maior que 100")
    .optional(),
});

export type CreateRepresentativeFormValues = z.infer<typeof createRepresentativeSchema>;
export type UpdateRepresentativeFormValues = z.infer<typeof updateRepresentativeSchema>;

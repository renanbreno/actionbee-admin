import { z } from "zod";
import { validateDocument, validateEmail } from "@/shared/utils/validations";

// Validador de email opcional - valida apenas se houver valor
const optionalEmailValidator = z
  .string()
  .optional()
  .refine((val) => !val || validateEmail(val), {
    message: "Informe um e-mail válido",
  });

const customerAddressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado deve ter 2 caracteres").max(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().refine(
    (val) => val.replace(/\D/g, "").length === 8,
    "CEP inválido"
  ),
  country: z.string().min(1, "País é obrigatório"),
});

// Validador de CPF/CNPJ
const documentRefinement = (value: string | undefined) => {
  if (!value) return true; // opcional
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 0) return true; // campo vazio
  if (cleaned.length === 11 || cleaned.length === 14) {
    return validateDocument(value);
  }
  return false; // Rejeitar documento com tamanho incorreto
};

// Schema sem senha - para admin criar cliente (senha será configurada pelo próprio cliente via link de ativação)
export const createCustomerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
  email: optionalEmailValidator,
  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((val) => val.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  document: z.string().optional().refine(documentRefinement, {
    message: "CPF ou CNPJ inválido",
  }),
  customerType: z.enum(['FINAL_CONSUMER', 'RETAILER_RESELLER', 'DISTRIBUTOR_RESELLER']).default('FINAL_CONSUMER'),
  stateRegistration: z.string().optional(),
  isIeExempt: z.boolean().optional().default(false),
  birthDate: z.string().optional(),
  address: customerAddressSchema.optional(),
});

// Schema sem senha - admin não altera senha do cliente
export const updateCustomerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome deve ter no máximo 100 caracteres").optional(),
  email: optionalEmailValidator,
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  document: z.string().optional().refine(documentRefinement, {
    message: "CPF ou CNPJ inválido",
  }),
  customerType: z.enum(['FINAL_CONSUMER', 'RETAILER_RESELLER', 'DISTRIBUTOR_RESELLER']).optional(),
  stateRegistration: z.string().optional(),
  isIeExempt: z.boolean().optional(),
  birthDate: z.string().optional(),
  address: customerAddressSchema.partial().optional(),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;
export type CreateCustomerFormInput = z.input<typeof createCustomerSchema>;
export type UpdateCustomerFormValues = z.infer<typeof updateCustomerSchema>;
export type UpdateCustomerFormInput = z.input<typeof updateCustomerSchema>;

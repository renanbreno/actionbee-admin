import { z } from "zod";

const emailValidator = z
  .string()
  .min(1, "O e-mail é obrigatório")
  .email("Informe um e-mail válido");

const customerAddressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado deve ter 2 caracteres").max(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  country: z.string().min(1, "País é obrigatório"),
});

// Schema sem senha - para admin criar cliente (senha será configurada pelo próprio cliente via link de ativação)
export const createCustomerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
  email: emailValidator,
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  cpf: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length === 11, "CPF inválido"),
  address: customerAddressSchema.optional(),
});

// Schema sem senha - admin não altera senha do cliente
export const updateCustomerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome deve ter no máximo 100 caracteres").optional(),
  email: emailValidator.optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  cpf: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length === 11, "CPF inválido"),
  address: customerAddressSchema.partial().optional(),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormValues = z.infer<typeof updateCustomerSchema>;

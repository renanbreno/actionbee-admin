import { z } from "zod";
import { validateEmail, validateDate, validatePhone } from "@/shared/utils/validations";

const emailValidator = z
  .string()
  .min(1, "O e-mail é obrigatório")
  .refine(validateEmail, { message: "Informe um e-mail válido" });

const optionalEmailValidator = z
  .string()
  .optional()
  .refine((val) => !val || validateEmail(val), {
    message: "Informe um e-mail válido",
  });

const cpfRefinement = (value: string | undefined) => {
  if (!value) return true;
  const cleaned = value.replace(/\D/g, "");
  return cleaned.length === 0 || cleaned.length === 11;
};

const baseVendedorSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: emailValidator,
  cpf: z
    .string()
    .optional()
    .refine(cpfRefinement, { message: "CPF inválido" }),
  phone: z.string().optional().refine(validatePhone, "Telefone inválido"),
  birthDate: z.string().optional().refine(validateDate, { message: "Data de nascimento inválida. Use o formato dd/mm/aaaa" }),
  commissionRate: z
    .number()
    .min(0, "A taxa de comissão não pode ser negativa")
    .max(100, "A taxa de comissão não pode ser maior que 100")
    .optional(),
});

export const createVendedorSchema = baseVendedorSchema;

export const updateVendedorSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .optional(),
  email: optionalEmailValidator,
  cpf: z
    .string()
    .optional()
    .refine(cpfRefinement, { message: "CPF inválido" }),
  phone: z.string().optional().refine(validatePhone, "Telefone inválido"),
  birthDate: z.string().optional().refine(validateDate, { message: "Data de nascimento inválida. Use o formato dd/mm/aaaa" }),
  commissionRate: z
    .number()
    .min(0, "A taxa de comissão não pode ser negativa")
    .max(100, "A taxa de comissão não pode ser maior que 100")
    .optional(),
});

export type CreateVendedorFormValues = z.infer<typeof createVendedorSchema>;
export type UpdateVendedorFormValues = z.infer<typeof updateVendedorSchema>;

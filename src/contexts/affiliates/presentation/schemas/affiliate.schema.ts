import { z } from "zod";
import { validateCPF, validateEmail, validateBirthDate, validatePhone } from "@/shared/utils/validations";

const urlValidator = z.string().refine(
  (val) => {
    if (!val) return true; // Allow empty strings (optional field)
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Informe uma URL válida" }
);

const socialMediaSchema = z.array(urlValidator);

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

const categoryIdSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v && v.trim() ? v : undefined));

// Base schema with all fields
const baseAffiliateSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: emailValidator,
  phone: z.string().optional().refine(validatePhone, "Telefone inválido"),
  cpf: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === "") return true;
      const cleaned = value.replace(/\D/g, "");
      // Só valida se tiver 11 dígitos
      if (cleaned.length === 11) {
        return validateCPF(value);
      }
      return true; // Não rejeitar se estiver incompleto
    }, { message: "CPF inválido" }),
  birthDate: z.string().optional().refine(validateBirthDate, { message: "Data de nascimento inválida. Use o formato dd/mm/aaaa" }),
  socialMedia: socialMediaSchema,
  commissionRate: z
    .number({ message: "Informe a taxa de comissão" })
    .min(0, "A taxa deve ser maior ou igual a 0")
    .max(100, "A taxa deve ser menor ou igual a 100"),
  categoryId: categoryIdSchema,
});

// Create schema - all required fields present, with optional couponId
export const createAffiliateSchema = baseAffiliateSchema.extend({
  couponId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.trim() ? v : undefined)),
});

// Update schema - campos específicos com validação adequada
export const updateAffiliateSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .optional(),
  email: optionalEmailValidator,
  phone: z.string().optional().refine(validatePhone, "Telefone inválido"),
  cpf: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === "") return true;
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length === 11) {
        return validateCPF(value);
      }
      return true;
    }, { message: "CPF inválido" })
    .optional(),
  birthDate: z.string().optional().refine(validateBirthDate, { message: "Data de nascimento inválida. Use o formato dd/mm/aaaa" }),
  socialMedia: socialMediaSchema.optional(),
  commissionRate: z
    .number()
    .min(0, "A taxa deve ser maior ou igual a 0")
    .max(100, "A taxa deve ser menor ou igual a 100")
    .optional(),
  categoryId: categoryIdSchema,
  couponId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.trim() ? v : undefined)),
});

export type CreateAffiliateFormValues = z.infer<typeof createAffiliateSchema>;
export type CreateAffiliateFormInput = z.input<typeof createAffiliateSchema>;
export type UpdateAffiliateFormValues = z.infer<typeof updateAffiliateSchema>;
export type UpdateAffiliateFormInput = z.input<typeof updateAffiliateSchema>;

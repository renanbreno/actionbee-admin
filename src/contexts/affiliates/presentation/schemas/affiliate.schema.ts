import { z } from "zod";

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

// Custom email validation that always returns a string error message
const emailValidator = z
  .string()
  .min(1, "O e-mail é obrigatório")
  .refine(
    (val) => {
      // More comprehensive email regex
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(val);
    },
    { message: "Informe um e-mail válido" }
  );

export const createAffiliateSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: emailValidator,
  phone: z.string().optional(),
  cpf: z.string().optional(),
  socialMedia: socialMediaSchema,
  commissionRate: z
    .number({ message: "Informe a taxa de comissão" })
    .min(0, "A taxa deve ser maior ou igual a 0")
    .max(100, "A taxa deve ser menor ou igual a 100"),
});

export type CreateAffiliateFormValues = z.infer<typeof createAffiliateSchema>;

// Update schema with all optional fields
export const updateAffiliateSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .optional(),
  email: emailValidator.optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  socialMedia: socialMediaSchema.optional(),
  commissionRate: z
    .number({ message: "Informe a taxa de comissão" })
    .min(0, "A taxa deve ser maior ou igual a 0")
    .max(100, "A taxa deve ser menor ou igual a 100"),
});

export type UpdateAffiliateFormValues = z.infer<typeof updateAffiliateSchema>;

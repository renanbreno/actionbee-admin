import { z } from "zod";
import { validateDocument, validateEmail } from "@/shared/utils/validations";

export const storeSettingsSchema = z.object({
  // Loja
  name: z.string().min(1, "Nome é obrigatório"),
  document: z
    .string()
    .min(1, "CNPJ/CPF é obrigatório")
    .refine((value) => {
      const cleaned = value.replace(/\D/g, "");
      // Só valida se tiver 11 ou 14 dígitos
      if (cleaned.length === 11 || cleaned.length === 14) {
        return validateDocument(value);
      }
      return true; // Não rejeitar se estiver incompleto
    }, { message: "CPF ou CNPJ inválido" }),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine((v) => /^\d{10,11}$/.test(v.replace(/\D/g, "")), "Telefone deve ter 10 ou 11 dígitos"),
  email: z.string().refine(validateEmail, { message: "E-mail inválido" }),

  // Endereço
  zipCode: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((v) => /^\d{8}$/.test(v.replace(/\D/g, "")), "CEP deve ter 8 dígitos"),
  address: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),

  // Frete grátis
  freeShippingEnabled: z.boolean(),
  freeShippingMinValue: z.number().min(0),

  // Entrega motoboy
  motoboyDeliveryEnabled: z.boolean(),
  motoboyDeliveryPrice: z.number().min(0),
  motoboyDeliveryTimeDays: z.number().min(1),

  // Parcelamento
  paymentMinInstallmentValue: z.number().min(0.01),
  paymentInterestFreeThreshold: z.number().min(0),
  paymentInterestFreeInstallmentsBelow: z.number().min(1),
  paymentInterestFreeInstallmentsAbove: z.number().min(1),
  paymentMaxInstallmentsLimit: z.number().min(1),

  // Brindes
  maxGiftsPerOrder: z.number().min(0),
});

export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;

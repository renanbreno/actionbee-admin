import { z } from "zod";

const emailValidator = z
  .string()
  .min(1, "O e-mail é obrigatório")
  .refine(
    (val) => {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(val);
    },
    { message: "Informe um e-mail válido" }
  );

const optionalEmailValidator = emailValidator
  .optional()
  .or(z.literal(""))
  .transform((v) => (v && v.trim() ? v : undefined));

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "O código deve ter pelo menos 3 caracteres")
      .max(30, "O código deve ter no máximo 30 caracteres")
      .transform((v) => v.toUpperCase().replace(/\s/g, "")),
    type: z.enum(["BY_CUSTOMER", "BY_PRODUCT", "FIRST_PURCHASE", "STORE_WIDE"], {
      message: "Selecione o tipo do cupom",
    }),
    discountPercentage: z
      .number({ message: "Informe a porcentagem de desconto" })
      .min(1, "O desconto mínimo é 1%")
      .max(99, "O desconto máximo é 99%"),
    maxDiscountAmount: z
      .number()
      .positive("Valor deve ser positivo")
      .optional()
      .or(z.nan())
      .transform((v) => (v && !isNaN(v) ? v : undefined)),
    minCartValue: z
      .number()
      .positive("Valor deve ser positivo")
      .optional()
      .or(z.nan())
      .transform((v) => (v && !isNaN(v) ? v : undefined)),
    expiresAt: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v && v.trim() ? new Date(v) : undefined)),
    usageLimit: z
      .number()
      .int("Deve ser um número inteiro")
      .positive("Deve ser maior que zero")
      .optional()
      .or(z.nan())
      .transform((v) => (v && !isNaN(v) ? v : undefined)),
    customerEmail: optionalEmailValidator,
    productId: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v && v.trim() ? v : undefined)),
  })
  .refine(
    (data) => {
      if (data.type === "BY_CUSTOMER" && !data.customerEmail) return false;
      return true;
    },
    { message: "Informe o e-mail do cliente", path: ["customerEmail"] },
  )
  .refine(
    (data) => {
      if (data.type === "BY_PRODUCT" && !data.productId) return false;
      return true;
    },
    { message: "Selecione um produto", path: ["productId"] },
  );

export type CreateCouponFormValues = z.infer<typeof createCouponSchema>;
export type CreateCouponFormInput = z.input<typeof createCouponSchema>;

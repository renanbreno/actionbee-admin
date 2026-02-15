import { z } from "zod";

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
    expiresAt: z.date().optional(),
    usageLimit: z
      .number()
      .int("Deve ser um número inteiro")
      .positive("Deve ser maior que zero")
      .optional()
      .or(z.nan())
      .transform((v) => (v && !isNaN(v) ? v : undefined)),
    customerId: z.string().optional().or(z.literal("")),
    productId: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.type === "BY_CUSTOMER" && !data.customerId) return false;
      return true;
    },
    { message: "Informe o ID do cliente", path: ["customerId"] },
  )
  .refine(
    (data) => {
      if (data.type === "BY_PRODUCT" && !data.productId) return false;
      return true;
    },
    { message: "Informe o ID do produto", path: ["productId"] },
  );

export type CreateCouponFormValues = z.infer<typeof createCouponSchema>;

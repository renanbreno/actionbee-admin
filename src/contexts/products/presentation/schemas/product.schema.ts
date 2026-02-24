import { z } from "zod";

export const productVariantSchema = z.object({
  name: z.string().min(1, "Nome da variante é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  unitsPerVariant: z
    .number()
    .int()
    .min(1, "Deve ser pelo menos 1"),
  price: z
    .number()
    .min(0, "Preço não pode ser negativo"),
  offerPrice: z
    .number()
    .min(0)
    .nullable()
    .optional(),
  retailerPrice: z
    .number()
    .min(0)
    .nullable()
    .optional(),
  height: z.number().min(0).nullable().optional(),
  width: z.number().min(0).nullable().optional(),
  depth: z.number().min(0).nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  ean: z.string().optional().nullable(),
  unitId: z.string().optional().nullable(),
  hasFreeShipping: z.boolean().optional(),
  isRetailerVariant: z.boolean().optional(),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(200, "O nome deve ter no máximo 200 caracteres"),
  // Rich text stored as JSON string
  description: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  usageRecommendation: z.string().optional().nullable(),
  stockUnits: z.number().int().min(0, "Estoque não pode ser negativo").optional().nullable(),
  brandId: z.string().optional().nullable(),
  variationType: z.string().optional().nullable(),
  isActive: z.boolean(),
  showOnEcommerce: z.boolean(),
  categoryId: z.string().optional().nullable(),
  variants: z
    .array(productVariantSchema)
    .min(1, "Adicione pelo menos uma variante"),
  imageFiles: z.array(z.custom<File>()),
  nutritionalTableImageFile: z.custom<File>().nullable().optional(),
  existingImages: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      order: z.number(),
    }),
  ),
  keepImageIds: z.array(z.string()),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

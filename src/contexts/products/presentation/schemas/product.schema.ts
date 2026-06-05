import { z } from "zod";
import { isValidJson } from "@/shared/utils/masks";

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
  distributorPrice: z
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

// --- Story Section Schemas ---

const textImageDataSchema = z.object({
  tag: z.string().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrl: z.string().optional(),
  imagePosition: z.enum(["left", "right", "center"]),
});

const comparisonTableRowSchema = z.object({
  label: z.string().min(1, "Label é obrigatório"),
  leftValue: z.string().min(1, "Valor é obrigatório"),
  rightValue: z.string().min(1, "Valor é obrigatório"),
  leftType: z.enum(["text", "boolean"]),
  rightType: z.enum(["text", "boolean"]),
});

const comparisonTableDataSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional(),
  leftImageUrl: z.string().optional(),
  rightImageUrl: z.string().optional(),
  rows: z.array(comparisonTableRowSchema).min(1, "Adicione pelo menos uma linha"),
});

const statItemSchema = z.object({
  value: z.string().min(1, "Valor é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

const statisticsDataSchema = z.object({
  tag: z.string().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  stats: z.array(statItemSchema).min(1, "Adicione pelo menos uma estatística"),
  backgroundColor: z.string().optional(),
});

export const storySectionSchema = z.object({
  id: z.string(),
  type: z.enum(["text_image", "comparison_table", "statistics"]),
  order: z.number(),
  data: z.union([textImageDataSchema, comparisonTableDataSchema, statisticsDataSchema]),
});

export type StorySectionFormValues = z.infer<typeof storySectionSchema>;

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(200, "O nome deve ter no máximo 200 caracteres"),
  // Rich text stored as JSON string
  description: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || isValidJson(val), {
      message: "Descrição com formato inválido",
    }),
  ingredients: z.string().optional().nullable(),
  usageRecommendation: z.string().optional().nullable(),
  costPrice: z.number().min(0, "Preço de custo não pode ser negativo"),
  brandId: z.string().optional().nullable(),
  flavorId: z.string().optional().nullable(),
  variationType: z.string().optional().nullable(),
  isActive: z.boolean(),
  showOnEcommerce: z.boolean(),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  variants: z
    .array(productVariantSchema)
    .min(1, "Adicione pelo menos uma variante"),
  storySections: z.array(storySectionSchema),
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

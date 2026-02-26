import { z } from "zod";

export const shipmentItemSchema = z
  .object({
    variantId: z.string().optional(),
    giftTierId: z.string().optional(),
    productName: z.string(),
    quantity: z.number().int().min(1, "Mínimo 1").max(9999),
    unitCost: z.number().min(0),
    unitsPerVariant: z.number().int().min(1).optional(),
    unitAcronym: z.string().optional(),
  })
  .refine(
    (item) => !!(item.variantId || item.giftTierId),
    "O item deve ter variantId (produto com variante) ou giftTierId (brinde) definido.",
  );

export const createShipmentSchema = z.object({
  affiliateId: z.string().min(1, "Selecione um afiliado"),
  referenceMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Formato inválido (AAAA-MM)"),
  notes: z.string().optional().nullable(),
  items: z
    .array(shipmentItemSchema)
    .min(1, "Adicione ao menos um produto"),
});

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

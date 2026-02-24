import { z } from "zod";

export const shipmentItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  productName: z.string(),
  quantity: z.number().int().min(1, "Mínimo 1"),
  unitCost: z.number().min(0),
});

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

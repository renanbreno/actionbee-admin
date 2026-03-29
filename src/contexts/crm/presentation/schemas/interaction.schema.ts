import { z } from "zod";
import { InteractionType } from "../../domain/enums";

const dateSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v) return true;
      const parts = v.split("/");
      if (parts.length !== 3) return false;
      const [day, month, year] = parts;
      if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;
      const date = new Date(`${year}-${month}-${day}`);
      return !isNaN(date.getTime());
    },
    { message: "Data inválida. Use o formato dd/mm/aaaa" }
  );

export const createInteractionSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
  type: z.nativeEnum(InteractionType),
  description: z.string().min(1, "Descrição é obrigatória"),
  dealId: z.string().optional(),
  subject: z.string().optional(),
  occurredAt: dateSchema,
});

export type CreateInteractionFormValues = z.infer<typeof createInteractionSchema>;

export const updateInteractionSchema = z.object({
  type: z.nativeEnum(InteractionType),
  description: z.string().min(1, "Descrição é obrigatória"),
  subject: z.string().optional(),
  occurredAt: dateSchema,
});

export type UpdateInteractionFormValues = z.infer<typeof updateInteractionSchema>;

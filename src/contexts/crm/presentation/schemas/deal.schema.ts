import { z } from "zod";

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

export const createDealSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  pipelineId: z.string().min(1, "Pipeline é obrigatório"),
  stageId: z.string().min(1, "Estágio é obrigatório"),
  customerId: z.string().min(1, "Cliente é obrigatório"),
  description: z.string().optional(),
  estimatedValue: z.string().optional(),
  expectedCloseDate: dateSchema,
  source: z.string().optional(),
});

export type CreateDealFormValues = z.infer<typeof createDealSchema>;

export const updateDealSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  estimatedValue: z.string().optional(),
  expectedCloseDate: dateSchema,
});

export type UpdateDealFormValues = z.infer<typeof updateDealSchema>;

export const moveDealStageSchema = z.object({
  stageId: z.string().min(1, "Estágio é obrigatório"),
  lostReason: z.string().optional(),
});

export type MoveDealStageFormValues = z.infer<typeof moveDealStageSchema>;

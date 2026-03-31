import { z } from "zod";
import { PipelineType } from "../../domain/enums";

export const createPipelineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.nativeEnum(PipelineType),
  description: z.string().optional(),
});

export type CreatePipelineFormValues = z.infer<typeof createPipelineSchema>;

export const updatePipelineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePipelineFormValues = z.infer<typeof updatePipelineSchema>;

export const addStageSchema = z.object({
  name: z.string().min(1, "Nome do estágio é obrigatório"),
  order: z.number().int().min(1),
  color: z.string().optional(),
  isWonStage: z.boolean().default(false),
  isLostStage: z.boolean().default(false),
});

export type AddStageFormValues = z.infer<typeof addStageSchema>;

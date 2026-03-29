import { z } from "zod";
import { TaskType, TaskPriority, TaskStatus } from "../../domain/enums";

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

export const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  type: z.nativeEnum(TaskType),
  description: z.string().optional(),
  dealId: z.string().optional(),
  customerId: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  dueDate: dateSchema,
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: dateSchema,
});

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;

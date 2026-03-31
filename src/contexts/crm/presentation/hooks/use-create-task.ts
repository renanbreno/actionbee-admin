"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTaskUseCase } from "../../di";
import type { CreateTaskDTO } from "../../domain/repositories/crm-task-repository.interface";

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTaskDTO) => createTaskUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Tarefa criada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

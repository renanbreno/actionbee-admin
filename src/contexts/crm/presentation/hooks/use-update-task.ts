"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTaskUseCase } from "../../di";
import type { UpdateTaskDTO } from "../../domain/repositories/crm-task-repository.interface";

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDTO }) =>
      updateTaskUseCase.execute(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deal", data.dealId] });
      toast.success("Tarefa atualizada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

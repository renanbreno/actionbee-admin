"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePipelineUseCase } from "../../di";
import type { UpdatePipelineDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export function useUpdatePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePipelineDTO }) =>
      updatePipelineUseCase.execute(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipelines"] });
      queryClient.invalidateQueries({ queryKey: ["crm-pipeline", id] });
      toast.success("Pipeline atualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

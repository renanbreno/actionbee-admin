"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addPipelineStageUseCase } from "../../di";
import type { AddStageDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export function useAddPipelineStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pipelineId, dto }: { pipelineId: string; dto: AddStageDTO }) =>
      addPipelineStageUseCase.execute(pipelineId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipelines"] });
      queryClient.invalidateQueries({ queryKey: ["crm-pipeline", data.id] });
      toast.success("Estágio adicionado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

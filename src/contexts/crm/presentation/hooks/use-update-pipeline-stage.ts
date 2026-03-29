"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePipelineStageUseCase } from "../../di";
import type { UpdateStageDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export function useUpdatePipelineStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pipelineId, stageId, dto }: { pipelineId: string; stageId: string; dto: UpdateStageDTO }) =>
      updatePipelineStageUseCase.execute(pipelineId, stageId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipeline", data.id] });
      toast.success("Estágio atualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

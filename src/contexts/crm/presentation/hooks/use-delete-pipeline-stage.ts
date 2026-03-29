"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePipelineStageUseCase } from "../../di";

export function useDeletePipelineStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pipelineId, stageId }: { pipelineId: string; stageId: string }) =>
      deletePipelineStageUseCase.execute(pipelineId, stageId),
    onSuccess: (_, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipeline", pipelineId] });
      queryClient.invalidateQueries({ queryKey: ["crm-pipelines"] });
      toast.success("Estágio removido");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

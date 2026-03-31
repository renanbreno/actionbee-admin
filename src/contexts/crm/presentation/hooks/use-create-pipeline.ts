"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPipelineUseCase } from "../../di";
import type { CreatePipelineDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export function useCreatePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePipelineDTO) => createPipelineUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipelines"] });
      toast.success("Pipeline criado com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

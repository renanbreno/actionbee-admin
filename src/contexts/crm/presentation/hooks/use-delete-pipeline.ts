"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePipelineUseCase } from "../../di";

export function useDeletePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePipelineUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipelines"] });
      toast.success("Pipeline excluído");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

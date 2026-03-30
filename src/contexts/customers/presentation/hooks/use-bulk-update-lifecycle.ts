"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bulkUpdateLifecycleStageUseCase } from "../../di";
import type { CustomerLifecycleStage } from "../../domain/entities/customer";

export function useBulkUpdateLifecycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, stage }: { ids: string[]; stage: CustomerLifecycleStage }) =>
      bulkUpdateLifecycleStageUseCase.execute(ids, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Estágio de ciclo de vida atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar estágio. Tente novamente.");
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { moveDealStageUseCase } from "../../di";
import type { MoveDealStageDTO } from "../../domain/repositories/crm-deal-repository.interface";

export function useMoveDealStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: MoveDealStageDTO }) =>
      moveDealStageUseCase.execute(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deal", data.id] });
      toast.success("Negócio movido para novo estágio");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

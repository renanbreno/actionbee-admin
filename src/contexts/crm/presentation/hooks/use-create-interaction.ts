"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createInteractionUseCase } from "../../di";
import type { CreateInteractionDTO } from "../../domain/repositories/crm-interaction-repository.interface";

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateInteractionDTO) => createInteractionUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Interação registrada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

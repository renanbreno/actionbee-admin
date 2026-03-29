"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateInteractionUseCase } from "../../di";
import type { UpdateInteractionDTO } from "../../domain/repositories/crm-interaction-repository.interface";

export function useUpdateInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInteractionDTO }) =>
      updateInteractionUseCase.execute(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions"] });
      toast.success("Interação atualizada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

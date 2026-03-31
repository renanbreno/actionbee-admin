"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteInteractionUseCase } from "../../di";

export function useDeleteInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInteractionUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions"] });
      toast.success("Interação excluída");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

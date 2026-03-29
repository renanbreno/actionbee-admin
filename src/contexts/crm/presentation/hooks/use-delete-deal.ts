"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDealUseCase } from "../../di";

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDealUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Negócio excluído");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

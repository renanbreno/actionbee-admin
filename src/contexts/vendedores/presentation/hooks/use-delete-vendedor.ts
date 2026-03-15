"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVendedorUseCase } from "../../di";

export function useDeleteVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVendedorUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVendedorUseCase } from "../../di";
import { UpdateVendedorParams } from "../../domain/repositories/vendedor-repository.interface";

export function useUpdateVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendedorParams }) =>
      updateVendedorUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
    },
  });
}

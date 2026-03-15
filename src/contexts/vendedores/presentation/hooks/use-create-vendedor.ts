"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVendedorUseCase } from "../../di";
import { CreateVendedorParams } from "../../domain/repositories/vendedor-repository.interface";

export function useCreateVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateVendedorParams) => createVendedorUseCase.execute(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
    },
  });
}

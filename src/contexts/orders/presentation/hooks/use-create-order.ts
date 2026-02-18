"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOrderUseCase } from "../../di";
import { CreateOrderDTO } from "../../application/dto/create-order.dto";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateOrderDTO) => createOrderUseCase.execute(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido criado com sucesso");
    },
    onError: (error: Error) => {
      console.error("Error creating order:", error);
      toast.error(error.message || "Erro ao criar pedido");
    },
  });
}

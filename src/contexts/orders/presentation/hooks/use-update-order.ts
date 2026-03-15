"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderUseCase } from "../../di";
import { UpdateOrderDTO } from "../../application/dto/update-order.dto";

export function useUpdateOrder(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateOrderDTO) => updateOrderUseCase.execute(orderId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Pedido atualizado com sucesso");
    },
    onError: (error: Error) => {
      console.error("Error updating order:", error);
      toast.error(error.message || "Erro ao atualizar pedido");
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderStatusUseCase } from "../../di";
import { UpdateOrderStatusDTO } from "../../application/dto/update-order-status.dto";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateOrderStatusDTO }) =>
      updateOrderStatusUseCase.execute(id, params),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      toast.success("Status do pedido atualizado");
    },
    onError: (error: Error) => {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Erro ao atualizar status do pedido");
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderUseCase } from "../../di";
import { UpdateOrderDTO } from "../../application/dto/update-order.dto";

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateOrderDTO }) =>
      updateOrderUseCase.execute(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido atualizado com sucesso");
    },
    onError: (error: Error) => {
      console.error("Error updating order:", error);
      toast.error(error.message || "Erro ao atualizar pedido");
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { commissionsApiClient } from "../../infrastructure/api/commissions-api.client";

export function useCancelCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => commissionsApiClient.cancel(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
      toast.success("Comissão cancelada");
    },
    onError: (error: Error) => {
      console.error("Error cancelling commission:", error);
      toast.error("Erro ao cancelar comissão");
    },
  });
}

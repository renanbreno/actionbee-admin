"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { commissionsApiClient } from "../../infrastructure/api/commissions-api.client";

export function useMarkCommissionPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => commissionsApiClient.markAsPaid(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
      toast.success("Comissão marcada como paga");
    },
    onError: (error: Error) => {
      console.error("Error marking commission as paid:", error);
      toast.error("Erro ao marcar comissão como paga");
    },
  });
}

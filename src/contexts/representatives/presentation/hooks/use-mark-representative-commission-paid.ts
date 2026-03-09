"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { representativesApiClient } from "../../infrastructure/api/representatives-api.client";

export function useMarkRepresentativeCommissionPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => representativesApiClient.markRepresentativeCommissionPaid(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
      toast.success("Comissão marcada como paga");
    },
    onError: (error: Error) => {
      console.error("Error marking representative commission as paid:", error);
      toast.error("Erro ao marcar comissão como paga");
    },
  });
}

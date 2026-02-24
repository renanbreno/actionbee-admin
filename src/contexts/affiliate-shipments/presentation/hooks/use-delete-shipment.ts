"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShipmentUseCase } from "../../di";

export function useDeleteShipment(affiliateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) =>
      deleteShipmentUseCase.execute(affiliateId, shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipments", affiliateId],
      });
    },
  });
}

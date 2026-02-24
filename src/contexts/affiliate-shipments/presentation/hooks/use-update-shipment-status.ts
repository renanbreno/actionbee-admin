"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShipmentStatusUseCase } from "../../di";
import { ShipmentStatus } from "../../domain/entities/affiliate-shipment";

export function useUpdateShipmentStatus(affiliateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shipmentId,
      status,
    }: {
      shipmentId: string;
      status: ShipmentStatus;
    }) =>
      updateShipmentStatusUseCase.execute(affiliateId, shipmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipments", affiliateId],
      });
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShipmentUseCase } from "../../di";
import { CreateShipmentDTO } from "../../domain/repositories/affiliate-shipment-repository.interface";

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      affiliateId,
      data,
    }: {
      affiliateId: string;
      data: CreateShipmentDTO;
    }) => createShipmentUseCase.execute(affiliateId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shipments", variables.affiliateId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipments-report"],
      });
    },
  });
}

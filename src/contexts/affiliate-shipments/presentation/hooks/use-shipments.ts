"use client";

import { useQuery } from "@tanstack/react-query";
import { getShipmentsByAffiliateUseCase } from "../../di";

export function useShipments(affiliateId: string, month?: string) {
  return useQuery({
    queryKey: ["shipments", affiliateId, month],
    queryFn: () =>
      getShipmentsByAffiliateUseCase.execute(affiliateId, month),
    enabled: !!affiliateId,
  });
}

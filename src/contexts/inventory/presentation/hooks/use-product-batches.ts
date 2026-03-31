"use client";

import { useQuery } from "@tanstack/react-query";
import { getBatchesUseCase } from "../../di";

export function useProductBatches(productId: string | null, includeInactive = false) {
  return useQuery({
    queryKey: ["product-batches", productId, includeInactive],
    queryFn: () => getBatchesUseCase.execute(productId!, includeInactive),
    enabled: !!productId,
  });
}

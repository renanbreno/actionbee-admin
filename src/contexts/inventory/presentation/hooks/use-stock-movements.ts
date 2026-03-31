"use client";

import { useQuery } from "@tanstack/react-query";
import { getMovementsUseCase } from "../../di";

export function useStockMovements(productId: string | null, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["stock-movements", productId, page, limit],
    queryFn: () => getMovementsUseCase.execute(productId!, page, limit),
    enabled: !!productId,
  });
}

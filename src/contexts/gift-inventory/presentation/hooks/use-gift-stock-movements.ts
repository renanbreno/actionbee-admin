"use client";

import { useQuery } from "@tanstack/react-query";
import { getGiftMovementsUseCase } from "../../di";

export function useGiftStockMovements(giftTierId: string | null, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["gift-stock-movements", giftTierId, page, limit],
    queryFn: () => getGiftMovementsUseCase.execute(giftTierId!, page, limit),
    enabled: !!giftTierId,
  });
}

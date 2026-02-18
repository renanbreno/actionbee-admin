"use client";

import { useQuery } from "@tanstack/react-query";
import { getGiftTiersUseCase } from "../../di";

export function useGiftTiers() {
  return useQuery({
    queryKey: ["gift-tiers"],
    queryFn: () => getGiftTiersUseCase.execute(),
  });
}

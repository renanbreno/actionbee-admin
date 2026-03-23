"use client";

import { useQuery } from "@tanstack/react-query";
import { getAbandonedCartsUseCase } from "../../di";
import { GetAbandonedCartsFiltersDTO } from "../../application/dto/get-abandoned-carts-filters.dto";

export function useAbandonedCarts(filters: GetAbandonedCartsFiltersDTO) {
  return useQuery({
    queryKey: ["abandoned-carts", filters],
    queryFn: () => getAbandonedCartsUseCase.execute(filters),
    refetchInterval: 5 * 60 * 1000,
  });
}

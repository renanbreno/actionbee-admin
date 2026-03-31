"use client";

import { useQuery } from "@tanstack/react-query";
import { getDealsUseCase } from "../../di";
import type { DealFilters } from "../../domain/repositories/crm-deal-repository.interface";

export function useDeals(page = 1, limit = 100, filters?: DealFilters) {
  return useQuery({
    queryKey: ["crm-deals", page, limit, filters],
    queryFn: () => getDealsUseCase.execute(page, limit, filters),
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getInteractionsUseCase } from "../../di";
import type { InteractionFilters } from "../../domain/repositories/crm-interaction-repository.interface";

export function useInteractions(page = 1, limit = 20, filters?: InteractionFilters) {
  return useQuery({
    queryKey: ["crm-interactions", page, limit, filters],
    queryFn: () => getInteractionsUseCase.execute(page, limit, filters),
  });
}

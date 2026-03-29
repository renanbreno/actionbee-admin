"use client";

import { useQuery } from "@tanstack/react-query";
import { getDealByIdUseCase } from "../../di";

export function useDeal(id: string) {
  return useQuery({
    queryKey: ["crm-deal", id],
    queryFn: () => getDealByIdUseCase.execute(id),
    enabled: !!id,
  });
}

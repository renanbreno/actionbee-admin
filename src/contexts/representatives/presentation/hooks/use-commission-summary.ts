"use client";

import { useQuery } from "@tanstack/react-query";
import { getCommissionSummaryUseCase } from "../../di";

export function useCommissionSummary() {
  return useQuery({
    queryKey: ["representative-commission-summary"],
    queryFn: () => getCommissionSummaryUseCase.execute(),
  });
}

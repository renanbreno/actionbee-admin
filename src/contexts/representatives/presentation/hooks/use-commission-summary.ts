"use client";

import { useQuery } from "@tanstack/react-query";
import { getCommissionSummaryUseCase } from "../../di";
import { SalesReportFilters } from "../../domain/repositories/representative-repository.interface";

export function useCommissionSummary(filters?: SalesReportFilters) {
  return useQuery({
    queryKey: ["representative-commission-summary", filters],
    queryFn: () => getCommissionSummaryUseCase.execute(filters),
  });
}

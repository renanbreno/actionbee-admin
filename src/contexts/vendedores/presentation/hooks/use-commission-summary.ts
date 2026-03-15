"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendedorCommissionSummaryUseCase } from "../../di";

export function useVendedorCommissionSummary() {
  return useQuery({
    queryKey: ["vendedor-commission-summary"],
    queryFn: () => getVendedorCommissionSummaryUseCase.execute(),
  });
}

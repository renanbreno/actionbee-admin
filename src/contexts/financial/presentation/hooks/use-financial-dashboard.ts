"use client";

import { useQuery } from "@tanstack/react-query";
import { getFinancialDashboardUseCase } from "../../di";

export function useFinancialDashboard() {
  return useQuery({
    queryKey: ["financial-dashboard"],
    queryFn: () => getFinancialDashboardUseCase.execute(),
  });
}

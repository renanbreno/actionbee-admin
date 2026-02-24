"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonthlyReportUseCase } from "../../di";

export function useMonthlyReport(month: string) {
  return useQuery({
    queryKey: ["shipments-report", month],
    queryFn: () => getMonthlyReportUseCase.execute(month),
    enabled: !!month,
  });
}

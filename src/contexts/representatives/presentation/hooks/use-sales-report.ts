"use client";

import { useQuery } from "@tanstack/react-query";
import { getSalesReportUseCase } from "../../di";

export function useSalesReport(
  representativeName?: string,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
) {
  return useQuery({
    queryKey: ["representative-sales-report", representativeName, startDate, endDate, page, limit],
    queryFn: () =>
      getSalesReportUseCase.execute({
        representativeName,
        startDate,
        endDate,
        page,
        limit,
      }),
  });
}

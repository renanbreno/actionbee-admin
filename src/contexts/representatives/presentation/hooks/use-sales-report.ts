"use client";

import { useQuery } from "@tanstack/react-query";
import { getSalesReportUseCase } from "../../di";

export function useSalesReport(
  representativeId?: string,
  representativeName?: string,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
) {
  return useQuery({
    queryKey: ["representative-sales-report", representativeId, representativeName, startDate, endDate, page, limit],
    queryFn: () =>
      getSalesReportUseCase.execute({
        representativeId,
        representativeName,
        startDate,
        endDate,
        page,
        limit,
      }),
  });
}

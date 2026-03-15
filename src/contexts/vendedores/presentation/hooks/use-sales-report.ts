"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendedorSalesReportUseCase } from "../../di";

export function useVendedorSalesReport(
  vendedorName?: string,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
) {
  return useQuery({
    queryKey: ["vendedor-sales-report", vendedorName, startDate, endDate, page, limit],
    queryFn: () =>
      getVendedorSalesReportUseCase.execute({
        vendedorName,
        startDate,
        endDate,
        page,
        limit,
      }),
  });
}

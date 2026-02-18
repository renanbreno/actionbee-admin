"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrdersUseCase } from "../../di";
import { GetOrdersFiltersDTO } from "../../application/dto/get-orders-filters.dto";

export function useOrders(filters: GetOrdersFiltersDTO) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getOrdersUseCase.execute(filters),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

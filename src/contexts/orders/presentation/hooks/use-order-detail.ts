"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderDetailUseCase } from "../../di";

export function useOrderDetail(id: string | null) {
  return useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => getOrderDetailUseCase.execute(id!),
    enabled: !!id,
  });
}

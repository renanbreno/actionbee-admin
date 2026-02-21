"use client";

import { useQuery } from "@tanstack/react-query";
import { getCouponsUseCase } from "../../di";

export function useCoupons(page: number = 1, limit: number = 10, search?: string, status?: string, affiliateCategoryId?: string) {
  return useQuery({
    queryKey: ["coupons", page, limit, search, status, affiliateCategoryId],
    queryFn: () => getCouponsUseCase.execute(page, limit, search, status, affiliateCategoryId),
  });
}

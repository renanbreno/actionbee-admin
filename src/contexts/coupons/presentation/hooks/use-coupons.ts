"use client";

import { useQuery } from "@tanstack/react-query";
import { getCouponsUseCase } from "../../di";

export function useCoupons(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["coupons", page, limit],
    queryFn: () => getCouponsUseCase.execute(page, limit),
  });
}

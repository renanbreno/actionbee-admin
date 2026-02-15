"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateCouponUseCase } from "../../di";

export function useActivateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => activateCouponUseCase.execute(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

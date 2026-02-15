"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateCouponUseCase } from "../../di";

export function useDeactivateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => deactivateCouponUseCase.execute(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

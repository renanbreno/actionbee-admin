"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCouponUseCase } from "../../di";

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => deleteCouponUseCase.execute(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

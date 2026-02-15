"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCouponUseCase } from "../../di";
import { CreateCouponDto } from "../../application/dto/create-coupon.dto";

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponDto) => createCouponUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

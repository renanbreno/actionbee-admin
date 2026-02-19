"use client";

import { useMutation } from "@tanstack/react-query";
import { setRelatedProductsUseCase } from "../../di";

export function useSetRelatedProducts(productId: string) {
  return useMutation({
    mutationFn: (relatedProducts: { productId: string; order?: number }[]) =>
      setRelatedProductsUseCase.execute(productId, relatedProducts),
  });
}

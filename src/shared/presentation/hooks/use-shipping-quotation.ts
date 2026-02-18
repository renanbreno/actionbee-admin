import { useMutation } from "@tanstack/react-query";
import { calculateShipping } from "@/shared/infrastructure/api/shipping/shipping-api.client";
import type {
  ShippingQuotationRequest,
  ShippingQuotationResponse,
} from "@/shared/infrastructure/api/shipping/types";

export function useShippingQuotation() {
  return useMutation<ShippingQuotationResponse, Error, ShippingQuotationRequest>(
    {
      mutationFn: (request: ShippingQuotationRequest) => calculateShipping(request),
    },
  );
}

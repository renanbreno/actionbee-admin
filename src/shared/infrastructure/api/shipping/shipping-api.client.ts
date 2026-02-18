import { apiFetch } from "../api-client";
import type {
  ShippingQuotationRequest,
  ShippingQuotationResponse,
} from "./types";

export async function calculateShipping(
  request: ShippingQuotationRequest,
): Promise<ShippingQuotationResponse> {
  return apiFetch<ShippingQuotationResponse>("/quotation/calculate", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

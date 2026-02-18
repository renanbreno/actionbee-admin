import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { CommissionReport } from "../../domain/entities/commission";

export interface GetCommissionsParams {
  couponCode?: string;
  status?: "PENDING" | "PAID" | "CANCELLED";
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export const commissionsApiClient = {
  getReport(params: GetCommissionsParams): Promise<CommissionReport> {
    const searchParams = new URLSearchParams();

    if (params.couponCode) searchParams.append("couponCode", params.couponCode);
    if (params.status) searchParams.append("status", params.status);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    searchParams.append("page", params.page.toString());
    searchParams.append("limit", params.limit.toString());

    return apiFetch<CommissionReport>(
      `/admin/commissions/report?${searchParams.toString()}`
    );
  },

  markAsPaid(orderId: string): Promise<void> {
    return apiFetch<void>(`/admin/commissions/orders/${orderId}/mark-paid`, {
      method: "PATCH",
    });
  },

  cancel(orderId: string): Promise<void> {
    return apiFetch<void>(`/admin/commissions/orders/${orderId}/cancel`, {
      method: "PATCH",
    });
  },
};

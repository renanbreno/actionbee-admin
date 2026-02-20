import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { DashboardMetrics } from "../../domain/entities/dashboard";

export interface GetDashboardParams {
  month?: number; // 1–12
  year?: number;
  force?: boolean;
}

export const dashboardApiClient = {
  getMetrics(params?: GetDashboardParams): Promise<DashboardMetrics> {
    const search = new URLSearchParams();
    if (params?.month) search.set("month", String(params.month));
    if (params?.year) search.set("year", String(params.year));
    if (params?.force) search.set("force", "true");
    const qs = search.toString();
    return apiFetch<DashboardMetrics>(`/admin/dashboard${qs ? `?${qs}` : ""}`);
  },
};

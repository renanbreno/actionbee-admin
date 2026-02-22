import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { DashboardMetrics } from "../../domain/entities/dashboard";

export type DashboardPeriod = "week" | "month" | "custom";

export interface GetDashboardParams {
  period?: DashboardPeriod;
  week?: number; // 1–53
  month?: number; // 1–12
  year?: number;
  from?: string; // ISO date string for custom period
  to?: string; // ISO date string for custom period
  force?: boolean;
}

export const dashboardApiClient = {
  getMetrics(params?: GetDashboardParams): Promise<DashboardMetrics> {
    const search = new URLSearchParams();
    if (params?.period) search.set("period", params.period);
    if (params?.week) search.set("week", String(params.week));
    if (params?.month) search.set("month", String(params.month));
    if (params?.year) search.set("year", String(params.year));
    if (params?.from) search.set("from", params.from);
    if (params?.to) search.set("to", params.to);
    if (params?.force) search.set("force", "true");
    const qs = search.toString();
    return apiFetch<DashboardMetrics>(`/admin/dashboard${qs ? `?${qs}` : ""}`);
  },
};

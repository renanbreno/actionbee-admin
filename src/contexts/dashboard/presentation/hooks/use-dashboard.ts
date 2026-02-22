"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApiClient, GetDashboardParams } from "../../infrastructure/api/dashboard-api.client";

export function useDashboard(params?: GetDashboardParams) {
  const queryClient = useQueryClient();
  const queryKey = ["dashboard", params?.period, params?.week, params?.month, params?.year, params?.from, params?.to];

  const query = useQuery({
    queryKey,
    queryFn: () => dashboardApiClient.getMetrics(params),
    staleTime: 5 * 60 * 1000,
  });

  const forceRefresh = async () => {
    const fresh = await dashboardApiClient.getMetrics({ ...params, force: true });
    queryClient.setQueryData(queryKey, fresh);
  };

  return { ...query, forceRefresh };
}

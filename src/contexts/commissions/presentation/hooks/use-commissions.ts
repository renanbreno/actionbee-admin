"use client";

import { useQuery } from "@tanstack/react-query";
import { commissionsApiClient, GetCommissionsParams } from "../../infrastructure/api/commissions-api.client";

export function useCommissions(params: GetCommissionsParams) {
  return useQuery({
    queryKey: ["commissions", params],
    queryFn: () => commissionsApiClient.getReport(params),
  });
}

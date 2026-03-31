import type { FinancialDashboard } from "../../domain/entities/dashboard";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetFinancialDashboardUseCase {
  execute(): Promise<FinancialDashboard> {
    return financialApiClient.getDashboard();
  }
}

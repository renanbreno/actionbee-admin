import type { FinancialTransaction } from "../../domain/entities/transaction";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetTransactionsUseCase {
  execute(params?: { type?: string; dateFrom?: string; dateTo?: string; accountId?: string }): Promise<FinancialTransaction[]> {
    return financialApiClient.getTransactions(params);
  }
}

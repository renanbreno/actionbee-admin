import type { AccountReceivable } from "../../domain/entities/receivable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class BatchPayReceivablesUseCase {
  execute(data: { ids: string[]; paidAt: string; accountId?: string }): Promise<AccountReceivable[]> {
    return financialApiClient.batchPayReceivables(data);
  }
}

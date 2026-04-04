import type { AccountPayable } from "../../domain/entities/payable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class BatchPayPayablesUseCase {
  execute(data: { ids: string[]; paidAt: string; accountId?: string }): Promise<AccountPayable[]> {
    return financialApiClient.batchPayPayables(data);
  }
}

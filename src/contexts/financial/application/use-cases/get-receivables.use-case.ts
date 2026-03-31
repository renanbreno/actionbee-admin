import type { AccountReceivable } from "../../domain/entities/receivable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetReceivablesUseCase {
  execute(params?: { status?: string; dueDateFrom?: string; dueDateTo?: string; customerId?: string; orderId?: string }): Promise<AccountReceivable[]> {
    return financialApiClient.getReceivables(params);
  }
}

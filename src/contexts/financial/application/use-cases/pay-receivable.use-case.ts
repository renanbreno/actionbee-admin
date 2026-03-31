import type { AccountReceivable } from "../../domain/entities/receivable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class PayReceivableUseCase {
  execute(id: string, data: { paidAt: string; paidAmount: number; accountId?: string }): Promise<AccountReceivable> {
    return financialApiClient.payReceivable(id, data);
  }
}

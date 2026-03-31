import type { AccountPayable } from "../../domain/entities/payable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class PayPayableUseCase {
  execute(id: string, data: { paidAt: string; paidAmount: number; accountId?: string }): Promise<AccountPayable> {
    return financialApiClient.payPayable(id, data);
  }
}

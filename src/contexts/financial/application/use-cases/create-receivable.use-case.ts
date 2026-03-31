import type { AccountReceivable } from "../../domain/entities/receivable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CreateReceivableUseCase {
  execute(data: { description: string; amount: number; dueDate: string; categoryId: string; accountId?: string; notes?: string }): Promise<AccountReceivable> {
    return financialApiClient.createReceivable(data);
  }
}

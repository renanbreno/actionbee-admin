import type { AccountPayable } from "../../domain/entities/payable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CreatePayableUseCase {
  execute(data: { description: string; amount: number; dueDate: string; categoryId: string; accountId?: string; supplierId?: string; notes?: string }): Promise<AccountPayable> {
    return financialApiClient.createPayable(data);
  }
}

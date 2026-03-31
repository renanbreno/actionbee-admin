import type { FinancialTransaction } from "../../domain/entities/transaction";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CreateTransactionUseCase {
  execute(data: { type: string; amount: number; date: string; description: string; accountId: string; categoryId?: string }): Promise<FinancialTransaction> {
    return financialApiClient.createTransaction(data);
  }
}

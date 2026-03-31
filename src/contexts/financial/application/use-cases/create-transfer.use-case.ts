import type { FinancialTransaction } from "../../domain/entities/transaction";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CreateTransferUseCase {
  execute(data: { amount: number; date: string; description: string; sourceAccountId: string; destinationAccountId: string; categoryId?: string }): Promise<FinancialTransaction> {
    return financialApiClient.createTransfer(data);
  }
}

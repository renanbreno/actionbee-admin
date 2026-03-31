import type { FinancialAccount } from "../../domain/entities/account";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class UpdateAccountUseCase {
  execute(id: string, data: { name?: string; bankName?: string; agency?: string; accountNumber?: string; active?: boolean }): Promise<FinancialAccount> {
    return financialApiClient.updateAccount(id, data);
  }
}

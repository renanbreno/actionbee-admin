import type { FinancialAccount } from "../../domain/entities/account";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CreateAccountUseCase {
  execute(data: { name: string; type: string; initialBalance?: number; bankName?: string; agency?: string; accountNumber?: string }): Promise<FinancialAccount> {
    return financialApiClient.createAccount(data);
  }
}

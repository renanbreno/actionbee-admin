import type { FinancialAccount } from "../../domain/entities/account";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetAccountsUseCase {
  execute(): Promise<FinancialAccount[]> {
    return financialApiClient.getAccounts();
  }
}

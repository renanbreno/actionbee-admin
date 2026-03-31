import type { AccountPayable } from "../../domain/entities/payable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetPayablesUseCase {
  execute(params?: { status?: string; dueDateFrom?: string; dueDateTo?: string; supplier?: string }): Promise<AccountPayable[]> {
    return financialApiClient.getPayables(params);
  }
}

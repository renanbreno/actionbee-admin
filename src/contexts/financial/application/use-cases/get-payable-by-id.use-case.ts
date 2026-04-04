import type { AccountPayable } from "../../domain/entities/payable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetPayableByIdUseCase {
  execute(id: string): Promise<AccountPayable> {
    return financialApiClient.getPayableById(id);
  }
}

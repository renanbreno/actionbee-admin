import type { AccountPayable } from "../../domain/entities/payable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CancelPayableUseCase {
  execute(id: string): Promise<AccountPayable> {
    return financialApiClient.cancelPayable(id);
  }
}

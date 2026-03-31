import type { AccountReceivable } from "../../domain/entities/receivable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CancelReceivableUseCase {
  execute(id: string): Promise<AccountReceivable> {
    return financialApiClient.cancelReceivable(id);
  }
}

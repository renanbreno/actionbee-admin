import type { AccountReceivable } from "../../domain/entities/receivable";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class ReverseReceivableUseCase {
  execute(id: string): Promise<AccountReceivable> {
    return financialApiClient.reverseReceivable(id);
  }
}

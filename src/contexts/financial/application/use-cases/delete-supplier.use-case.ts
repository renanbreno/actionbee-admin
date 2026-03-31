import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class DeleteSupplierUseCase {
  execute(id: string): Promise<void> {
    return financialApiClient.deleteSupplier(id);
  }
}

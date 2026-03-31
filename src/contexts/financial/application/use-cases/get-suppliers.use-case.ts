import type { Supplier } from "../../domain/entities/supplier";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetSuppliersUseCase {
  execute(params?: { active?: boolean; search?: string }): Promise<Supplier[]> {
    return financialApiClient.getSuppliers(params);
  }
}

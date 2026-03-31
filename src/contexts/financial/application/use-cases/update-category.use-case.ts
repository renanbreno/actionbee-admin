import type { FinancialCategory } from "../../domain/entities/category";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class UpdateCategoryUseCase {
  execute(id: string, data: { name?: string; color?: string; active?: boolean }): Promise<FinancialCategory> {
    return financialApiClient.updateCategory(id, data);
  }
}

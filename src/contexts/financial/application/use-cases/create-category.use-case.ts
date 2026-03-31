import type { FinancialCategory } from "../../domain/entities/category";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class CreateCategoryUseCase {
  execute(data: { name: string; type: string; color?: string }): Promise<FinancialCategory> {
    return financialApiClient.createCategory(data);
  }
}

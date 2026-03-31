import type { FinancialCategory } from "../../domain/entities/category";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetCategoriesUseCase {
  execute(type?: string): Promise<FinancialCategory[]> {
    return financialApiClient.getCategories(type);
  }
}

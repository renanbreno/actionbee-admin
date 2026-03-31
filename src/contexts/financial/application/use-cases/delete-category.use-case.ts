import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class DeleteCategoryUseCase {
  execute(id: string): Promise<void> {
    return financialApiClient.deleteCategory(id);
  }
}

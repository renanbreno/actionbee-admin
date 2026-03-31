import type { FinancialSettings } from "../../domain/entities/settings";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class GetSettingsUseCase {
  execute(): Promise<FinancialSettings> {
    return financialApiClient.getSettings();
  }
}

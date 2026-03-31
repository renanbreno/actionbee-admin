import type { FinancialSettings } from "../../domain/entities/settings";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class UpdateSettingsUseCase {
  execute(data: Partial<Pick<FinancialSettings, "creditCardSettlementDays" | "debitCardSettlementDays" | "pixSettlementDays" | "boletoSettlementDays">>): Promise<FinancialSettings> {
    return financialApiClient.updateSettings(data);
  }
}

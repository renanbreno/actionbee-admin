export interface FinancialSettings {
  id: string;
  creditCardSettlementDays: number;
  debitCardSettlementDays: number;
  pixSettlementDays: number;
  boletoSettlementDays: number;
  boletoAccountId: string | null;
  mercadoPagoAccountId: string | null;
  pixDirectAccountId: string | null;
  defaultOrderCategoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

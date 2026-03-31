import type { FinancialCategoryType } from "../enums";

export interface FinancialCategory {
  id: string;
  name: string;
  type: FinancialCategoryType;
  color: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

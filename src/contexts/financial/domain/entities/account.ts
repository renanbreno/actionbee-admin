import type { FinancialAccountType } from "../enums";

export interface FinancialAccount {
  id: string;
  name: string;
  type: FinancialAccountType;
  initialBalance: number;
  currentBalance: number;
  bankName: string | null;
  agency: string | null;
  accountNumber: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

import type { FinancialTransactionType } from "../enums";

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  amount: number;
  date: string;
  description: string;
  accountId: string;
  accountName: string;
  destinationAccountId: string | null;
  destinationAccountName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  receivableId: string | null;
  payableId: string | null;
  referenceType: string;
  referenceId: string | null;
  createdAt: string;
  updatedAt: string;
}

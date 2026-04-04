import type { FinancialStatus } from "../enums";

export interface AccountPayable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: FinancialStatus;
  categoryId: string;
  categoryName: string;
  accountId: string | null;
  accountName: string | null;
  supplierId: string | null;
  supplierName: string | null;
  orderId: string | null;
  paidAt: string | null;
  paidAmount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

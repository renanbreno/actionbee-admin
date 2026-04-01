import type { FinancialStatus } from "../enums";

export interface AccountReceivable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: FinancialStatus;
  categoryId: string;
  categoryName: string;
  accountId: string | null;
  accountName: string | null;
  orderId: string | null;
  customerId: string | null;
  customerName: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  paidAmount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

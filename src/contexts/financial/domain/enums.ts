export type FinancialCategoryType = "INCOME" | "EXPENSE";
export type FinancialAccountType = "CASH" | "BANK";
export type FinancialStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" | "PARTIALLY_PAID";
export type FinancialTransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export const FINANCIAL_CATEGORY_TYPE_LABELS: Record<FinancialCategoryType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
};

export const FINANCIAL_ACCOUNT_TYPE_LABELS: Record<FinancialAccountType, string> = {
  CASH: "Caixa",
  BANK: "Banco",
};

export const FINANCIAL_STATUS_LABELS: Record<FinancialStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Vencido",
  CANCELLED: "Cancelado",
  PARTIALLY_PAID: "Pago Parcialmente",
};

export const FINANCIAL_TRANSACTION_TYPE_LABELS: Record<FinancialTransactionType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
  TRANSFER: "Transferência",
};

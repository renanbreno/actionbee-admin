export interface FinancialDashboard {
  accounts: {
    id: string;
    name: string;
    type: string;
    currentBalance: number;
  }[];
  totalBalance: number;
  receivables: {
    pending: number;
    overdue: number;
    paidThisMonth: number;
    pendingCount: number;
    overdueCount: number;
  };
  payables: {
    pending: number;
    overdue: number;
    paidThisMonth: number;
    pendingCount: number;
    overdueCount: number;
  };
  cashFlow: {
    incomeThisMonth: number;
    expenseThisMonth: number;
    balanceThisMonth: number;
  };
}

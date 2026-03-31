import { apiFetch } from "@/shared/infrastructure/api/api-client";
import type { FinancialCategory } from "../../domain/entities/category";
import type { FinancialAccount } from "../../domain/entities/account";
import type { AccountReceivable } from "../../domain/entities/receivable";
import type { AccountPayable } from "../../domain/entities/payable";
import type { FinancialTransaction } from "../../domain/entities/transaction";
import type { FinancialDashboard } from "../../domain/entities/dashboard";
import type { FinancialSettings } from "../../domain/entities/settings";
import type { Supplier } from "../../domain/entities/supplier";

export const financialApiClient = {
  // --- Settings ---
  getSettings: (): Promise<FinancialSettings> =>
    apiFetch("/admin/financial/settings"),

  updateSettings: (data: Partial<Pick<FinancialSettings, "creditCardSettlementDays" | "debitCardSettlementDays" | "pixSettlementDays" | "boletoSettlementDays" | "boletoAccountId" | "mercadoPagoAccountId" | "pixDirectAccountId" | "defaultOrderCategoryId">>): Promise<FinancialSettings> =>
    apiFetch("/admin/financial/settings", { method: "PUT", body: JSON.stringify(data) }),

  // --- Dashboard ---
  getDashboard: (): Promise<FinancialDashboard> =>
    apiFetch("/admin/financial/dashboard"),

  // --- Categories ---
  getCategories: (type?: string): Promise<FinancialCategory[]> => {
    const params = type ? `?type=${type}` : "";
    return apiFetch(`/admin/financial/categories${params}`);
  },

  createCategory: (data: { name: string; type: string; color?: string }): Promise<FinancialCategory> =>
    apiFetch("/admin/financial/categories", { method: "POST", body: JSON.stringify(data) }),

  updateCategory: (id: string, data: { name?: string; color?: string; active?: boolean }): Promise<FinancialCategory> =>
    apiFetch(`/admin/financial/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteCategory: (id: string): Promise<void> =>
    apiFetch(`/admin/financial/categories/${id}`, { method: "DELETE" }),

  // --- Accounts ---
  getAccounts: (): Promise<FinancialAccount[]> =>
    apiFetch("/admin/financial/accounts"),

  createAccount: (data: { name: string; type: string; initialBalance?: number; bankName?: string; agency?: string; accountNumber?: string }): Promise<FinancialAccount> =>
    apiFetch("/admin/financial/accounts", { method: "POST", body: JSON.stringify(data) }),

  updateAccount: (id: string, data: { name?: string; bankName?: string; agency?: string; accountNumber?: string; active?: boolean }): Promise<FinancialAccount> =>
    apiFetch(`/admin/financial/accounts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  // --- Accounts Receivable ---
  getReceivables: (params?: { status?: string; dueDateFrom?: string; dueDateTo?: string; customerId?: string; orderId?: string }): Promise<AccountReceivable[]> => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.dueDateFrom) qs.set("dueDateFrom", params.dueDateFrom);
    if (params?.dueDateTo) qs.set("dueDateTo", params.dueDateTo);
    if (params?.customerId) qs.set("customerId", params.customerId);
    if (params?.orderId) qs.set("orderId", params.orderId);
    const query = qs.toString();
    return apiFetch(`/admin/financial/accounts-receivable${query ? `?${query}` : ""}`);
  },

  createReceivable: (data: { description: string; amount: number; dueDate: string; categoryId: string; accountId?: string; orderId?: string; customerId?: string; notes?: string }): Promise<AccountReceivable> =>
    apiFetch("/admin/financial/accounts-receivable", { method: "POST", body: JSON.stringify(data) }),

  payReceivable: (id: string, data: { paidAt: string; paidAmount: number; accountId?: string }): Promise<AccountReceivable> =>
    apiFetch(`/admin/financial/accounts-receivable/${id}/pay`, { method: "POST", body: JSON.stringify(data) }),

  cancelReceivable: (id: string): Promise<AccountReceivable> =>
    apiFetch(`/admin/financial/accounts-receivable/${id}/cancel`, { method: "POST" }),

  reverseReceivable: (id: string): Promise<AccountReceivable> =>
    apiFetch(`/admin/financial/accounts-receivable/${id}/reverse`, { method: "POST" }),

  // --- Suppliers ---
  getSuppliers: (params?: { active?: boolean; search?: string }): Promise<Supplier[]> => {
    const qs = new URLSearchParams();
    if (params?.active !== undefined) qs.set("active", String(params.active));
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return apiFetch(`/admin/suppliers${query ? `?${query}` : ""}`);
  },

  createSupplier: (data: { razaoSocial: string; nomeFantasia?: string; cnpj?: string; inscricaoEstadual?: string; email?: string; phone?: string; street?: string; number?: string; complement?: string; city?: string; state?: string; zipCode?: string; country?: string; notes?: string; active?: boolean }): Promise<Supplier> =>
    apiFetch("/admin/suppliers", { method: "POST", body: JSON.stringify(data) }),

  updateSupplier: (id: string, data: { razaoSocial?: string; nomeFantasia?: string; cnpj?: string; inscricaoEstadual?: string; email?: string; phone?: string; street?: string; number?: string; complement?: string; city?: string; state?: string; zipCode?: string; country?: string; notes?: string; active?: boolean }): Promise<Supplier> =>
    apiFetch(`/admin/suppliers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteSupplier: (id: string): Promise<void> =>
    apiFetch(`/admin/suppliers/${id}`, { method: "DELETE" }),

  // --- Accounts Payable ---
  getPayables: (params?: { status?: string; dueDateFrom?: string; dueDateTo?: string; supplierId?: string }): Promise<AccountPayable[]> => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.dueDateFrom) qs.set("dueDateFrom", params.dueDateFrom);
    if (params?.dueDateTo) qs.set("dueDateTo", params.dueDateTo);
    if (params?.supplierId) qs.set("supplierId", params.supplierId);
    const query = qs.toString();
    return apiFetch(`/admin/financial/accounts-payable${query ? `?${query}` : ""}`);
  },

  createPayable: (data: { description: string; amount: number; dueDate: string; categoryId: string; accountId?: string; supplierId?: string; notes?: string }): Promise<AccountPayable> =>
    apiFetch("/admin/financial/accounts-payable", { method: "POST", body: JSON.stringify(data) }),

  payPayable: (id: string, data: { paidAt: string; paidAmount: number; accountId?: string }): Promise<AccountPayable> =>
    apiFetch(`/admin/financial/accounts-payable/${id}/pay`, { method: "POST", body: JSON.stringify(data) }),

  cancelPayable: (id: string): Promise<AccountPayable> =>
    apiFetch(`/admin/financial/accounts-payable/${id}/cancel`, { method: "POST" }),

  // --- Transactions ---
  getTransactions: (params?: { type?: string; dateFrom?: string; dateTo?: string; accountId?: string }): Promise<FinancialTransaction[]> => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set("type", params.type);
    if (params?.dateFrom) qs.set("dateFrom", params.dateFrom);
    if (params?.dateTo) qs.set("dateTo", params.dateTo);
    if (params?.accountId) qs.set("accountId", params.accountId);
    const query = qs.toString();
    return apiFetch(`/admin/financial/transactions${query ? `?${query}` : ""}`);
  },

  createTransaction: (data: { type: string; amount: number; date: string; description: string; accountId: string; categoryId?: string }): Promise<FinancialTransaction> =>
    apiFetch("/admin/financial/transactions", { method: "POST", body: JSON.stringify(data) }),

  createTransfer: (data: { amount: number; date: string; description: string; sourceAccountId: string; destinationAccountId: string; categoryId?: string }): Promise<FinancialTransaction> =>
    apiFetch("/admin/financial/transactions/transfer", { method: "POST", body: JSON.stringify(data) }),
};

"use client";

import { useFinancialDashboard } from "../hooks/use-financial-dashboard";
import { TrendingUp, TrendingDown, Landmark, ArrowUpCircle, ArrowDownCircle, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function KpiCard({ title, value, subtitle, icon: Icon, variant = "default" }: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  variant?: "default" | "income" | "expense" | "warning";
}) {
  const iconColors = {
    default: "text-muted-foreground",
    income: "text-emerald-600",
    expense: "text-red-600",
    warning: "text-amber-600",
  };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className={cn("mt-1 text-2xl font-bold tracking-tight",
            variant === "income" ? "text-emerald-600" : variant === "expense" ? "text-red-600" : variant === "warning" ? "text-amber-600" : ""
          )}>
            {value}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("shrink-0 rounded-lg bg-muted/60 p-2", iconColors[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function FinancialDashboard() {
  const { data, isLoading, isError } = useFinancialDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-sm animate-pulse space-y-3">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-7 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive text-center py-8">Erro ao carregar dashboard</p>;
  }

  return (
    <div className="space-y-6">
      {/* Saldo e fluxo do mês */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Saldo Total"
          value={formatCurrency(data.totalBalance)}
          subtitle={`${data.accounts.length} conta(s)`}
          icon={Landmark}
          variant={data.totalBalance < 0 ? "expense" : "income"}
        />
        <KpiCard
          title="Receitas do Mês"
          value={formatCurrency(data.cashFlow.incomeThisMonth)}
          icon={ArrowUpCircle}
          variant="income"
        />
        <KpiCard
          title="Despesas do Mês"
          value={formatCurrency(data.cashFlow.expenseThisMonth)}
          icon={ArrowDownCircle}
          variant="expense"
        />
        <KpiCard
          title="Resultado do Mês"
          value={formatCurrency(data.cashFlow.balanceThisMonth)}
          icon={Scale}
          variant={data.cashFlow.balanceThisMonth >= 0 ? "income" : "expense"}
        />
        <KpiCard
          title="A Receber (Pendente)"
          value={formatCurrency(data.receivables.pending)}
          subtitle={`${data.receivables.pendingCount} parcela(s)`}
          icon={TrendingUp}
          variant="income"
        />
        <KpiCard
          title="A Pagar (Pendente)"
          value={formatCurrency(data.payables.pending)}
          subtitle={`${data.payables.pendingCount} parcela(s)`}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      {/* Alertas de vencidos */}
      {(data.receivables.overdueCount > 0 || data.payables.overdueCount > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.receivables.overdueCount > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-sm font-semibold text-amber-700">Recebimentos em atraso</p>
              <p className="mt-1 text-xl font-bold text-amber-700">{formatCurrency(data.receivables.overdue)}</p>
              <p className="text-xs text-amber-600">{data.receivables.overdueCount} conta(s) vencida(s)</p>
            </div>
          )}
          {data.payables.overdueCount > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-sm font-semibold text-red-700">Pagamentos em atraso</p>
              <p className="mt-1 text-xl font-bold text-red-700">{formatCurrency(data.payables.overdue)}</p>
              <p className="text-xs text-red-600">{data.payables.overdueCount} conta(s) vencida(s)</p>
            </div>
          )}
        </div>
      )}

      {/* Saldo por conta */}
      {data.accounts.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contas</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.accounts.map((account) => (
              <div key={account.id} className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">{account.type === "BANK" ? "Banco" : "Caixa"}</p>
                </div>
                <p className={cn("text-base font-bold shrink-0", account.currentBalance < 0 ? "text-red-600" : "text-emerald-600")}>
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, TrendingUp, Percent } from "lucide-react";
import { SalesReportSummary as SalesReportSummaryType } from "../../domain/entities/sales-report";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface SalesReportSummaryProps {
  summary: SalesReportSummaryType;
  isLoading?: boolean;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bee-gold/10 shrink-0">
          <Icon className="h-5 w-5 text-bee-gold" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <div className="h-6 w-24 animate-pulse rounded bg-muted mt-1" />
          ) : (
            <p className="text-lg font-semibold truncate">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesReportSummary({ summary, isLoading }: SalesReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        label="Total de Pedidos"
        value={String(summary.totalOrders)}
        icon={ShoppingCart}
        isLoading={isLoading}
      />
      <SummaryCard
        label="Receita Bruta"
        value={formatCurrency(summary.grossRevenue)}
        icon={DollarSign}
        isLoading={isLoading}
      />
      <SummaryCard
        label="Receita Líquida"
        value={formatCurrency(summary.netRevenue)}
        icon={TrendingUp}
        isLoading={isLoading}
      />
      <SummaryCard
        label="Comissão Total"
        value={formatCurrency(summary.totalCommission)}
        icon={Percent}
        isLoading={isLoading}
      />
    </div>
  );
}

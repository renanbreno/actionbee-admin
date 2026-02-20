"use client";

import { useState } from "react";
import { ShoppingCart, TrendingUp, Banknote, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardSales, OrdersByStatus } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { DashboardRevenueChart } from "./dashboard-revenue-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const COLLAPSED_COUNT = 5;

const STATUS_CONFIG: Record<string, { label: string; barColor: string; dotColor: string }> = {
  PENDING:    { label: "Pendente",     barColor: "bg-yellow-400",  dotColor: "bg-yellow-400" },
  CONFIRMED:  { label: "Confirmado",   barColor: "bg-sky-400",     dotColor: "bg-sky-400" },
  PROCESSING: { label: "Processando",  barColor: "bg-blue-400",    dotColor: "bg-blue-400" },
  PAID:       { label: "Pago",         barColor: "bg-emerald-400", dotColor: "bg-emerald-400" },
  APPROVED:   { label: "Aprovado",     barColor: "bg-emerald-400", dotColor: "bg-emerald-400" },
  SHIPPED:    { label: "Enviado",      barColor: "bg-violet-400",  dotColor: "bg-violet-400" },
  DELIVERED:  { label: "Entregue",     barColor: "bg-green-400",   dotColor: "bg-green-400" },
  CANCELLED:  { label: "Cancelado",    barColor: "bg-red-400",     dotColor: "bg-red-400" },
  REFUNDED:   { label: "Reembolsado",  barColor: "bg-orange-400",  dotColor: "bg-orange-400" },
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function OrderStatusList({
  statuses,
  isLoading,
}: {
  statuses: OrdersByStatus[];
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sorted = [...statuses].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((sum, s) => sum + s.count, 0);
  const hasMore = sorted.length > COLLAPSED_COUNT;
  const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold">Pedidos por Status</p>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-0.5 px-2 text-xs text-muted-foreground gap-1"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <><ChevronUp className="h-3 w-3" /> Ver menos</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> Ver todos ({sorted.length})</>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {visible.map(({ status, count }) => {
          const cfg = STATUS_CONFIG[status] ?? {
            label: status,
            barColor: "bg-muted-foreground",
            dotColor: "bg-muted-foreground",
          };
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={status}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${cfg.dotColor}`} />
                  <span className="text-xs text-muted-foreground">{cfg.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">{count}</span>
                  <span className="text-xs text-muted-foreground w-7 text-right">{pct}%</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${cfg.barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
        Total: <span className="font-semibold text-foreground">{total}</span> pedidos no período
      </p>
    </div>
  );
}

interface DashboardSalesSectionProps {
  data: DashboardSales | undefined;
  isLoading: boolean;
}

export function DashboardSalesSection({ data, isLoading }: DashboardSalesSectionProps) {
  const metrics = [
    {
      title: "Total de Pedidos",
      value: isLoading ? "—" : String(data?.totalOrders ?? 0),
      icon: ShoppingCart,
      iconColor: "text-bee-gold",
      iconBgColor: "bg-bee-gold/10",
      trend: data?.comparison.changePercent.totalOrders,
      subtitle: "vs. período anterior",
    },
    {
      title: "Receita Bruta",
      value: isLoading ? "—" : formatCurrency(data?.grossRevenue ?? 0),
      icon: BarChart3,
      iconColor: "text-emerald-600",
      iconBgColor: "bg-emerald-500/10",
      trend: data?.comparison.changePercent.grossRevenue,
      subtitle: "vs. período anterior",
    },
    {
      title: "Receita Líquida",
      value: isLoading ? "—" : formatCurrency(data?.netRevenue ?? 0),
      icon: Banknote,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-500/10",
      trend: data?.comparison.changePercent.netRevenue,
      subtitle: "vs. período anterior",
    },
    {
      title: "Ticket Médio",
      value: isLoading ? "—" : formatCurrency(data?.avgOrderValue ?? 0),
      icon: TrendingUp,
      iconColor: "text-violet-600",
      iconBgColor: "bg-violet-500/10",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-bee-gold/10">
          <ShoppingCart className="h-4 w-4 text-bee-gold" />
        </div>
        <h2 className="text-base font-semibold">Vendas</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <DashboardMetricCard key={m.title} {...m} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardRevenueChart data={data?.revenueByDay ?? []} isLoading={isLoading} />
        </div>
        <OrderStatusList statuses={data?.ordersByStatus ?? []} isLoading={isLoading} />
      </div>
    </section>
  );
}

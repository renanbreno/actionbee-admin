"use client";

import { useState } from "react";
import { ShoppingCart, TrendingUp, Banknote, BarChart3, ChevronDown, ChevronUp, Radio } from "lucide-react";
import { DashboardSales, OrdersByStatus, SalesBySource } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { DashboardRevenueChart } from "./dashboard-revenue-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  WHATSAPP:  { label: "WhatsApp",    color: "#22c55e" },
  IN_STORE:  { label: "Loja Física", color: "#FBBD23" },
  INSTAGRAM: { label: "Instagram",   color: "#ec4899" },
  ECOMMERCE: { label: "E-commerce",  color: "#6366f1" },
};

function SourceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: SalesBySource }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const cfg = SOURCE_CONFIG[d.source] ?? { label: d.source, color: "#94a3b8" };
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs space-y-0.5">
      <p className="font-semibold mb-1.5" style={{ color: cfg.color }}>{cfg.label}</p>
      <p className="text-muted-foreground">{d.orders} pedido{d.orders !== 1 ? "s" : ""} · <span className="font-medium text-foreground">{d.percentage.toFixed(1)}%</span></p>
      <p>Bruto: <span className="font-medium">{formatCurrency(d.grossRevenue)}</span></p>
      <p>Líquido: <span className="font-medium text-emerald-600">{formatCurrency(d.netRevenue)}</span></p>
    </div>
  );
}

function SalesBySourceCard({
  salesBySource,
  isLoading,
}: {
  salesBySource: SalesBySource[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-36 mb-5" />
        <div className="flex flex-col sm:flex-row gap-6">
          <Skeleton className="h-40 w-full sm:w-44 rounded-full mx-auto" />
          <div className="flex-1 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!salesBySource.length) return null;

  const sorted = [...salesBySource].sort((a, b) => b.orders - a.orders);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Radio className="h-4 w-4 text-bee-gold" />
        <p className="text-sm font-semibold">Vendas por Canal</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Donut chart */}
        <div className="w-44 shrink-0">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={sorted}
                dataKey="percentage"
                nameKey="source"
                innerRadius={48}
                outerRadius={72}
                strokeWidth={2}
                stroke="hsl(var(--card))"
              >
                {sorted.map((entry) => {
                  const cfg = SOURCE_CONFIG[entry.source] ?? { color: "#94a3b8" };
                  return <Cell key={entry.source} fill={cfg.color} />;
                })}
              </Pie>
              <Tooltip content={<SourceTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Channel list */}
        <div className="flex-1 w-full space-y-4">
          {sorted.map((item) => {
            const cfg = SOURCE_CONFIG[item.source] ?? { label: item.source, color: "#94a3b8" };
            return (
              <div key={item.source}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <span className="text-xs font-medium">{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-muted-foreground">{item.orders} pedido{item.orders !== 1 ? "s" : ""}</span>
                    <span className="font-semibold w-10 text-right">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: cfg.color }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pl-3.5">
                  <span>
                    Bruto:{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(item.grossRevenue)}
                    </span>
                  </span>
                  <span>
                    Líquido:{" "}
                    <span className="font-medium text-emerald-600">
                      {formatCurrency(item.netRevenue)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

      <SalesBySourceCard salesBySource={data?.salesBySource ?? []} isLoading={isLoading} />
    </section>
  );
}

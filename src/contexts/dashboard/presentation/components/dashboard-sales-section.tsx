"use client";

import { useState } from "react";
import { ShoppingCart, TrendingUp, Banknote, BarChart3, ChevronDown, ChevronUp, Radio, Gift, Users, Crown } from "lucide-react";
import { DashboardSales, GiftMetrics, OrdersByStatus, SalesBySource, ChannelBreakdown, TopRepresentative } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { DashboardRevenueChart } from "./dashboard-revenue-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardChannels } from "../../domain/entities/dashboard";

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
  WHATSAPP:       { label: "WhatsApp",     color: "#22c55e" },
  IN_STORE:       { label: "Loja Física",  color: "#FBBD23" },
  INSTAGRAM:      { label: "Instagram",    color: "#ec4899" },
  ECOMMERCE:      { label: "E-commerce",   color: "#6366f1" },
  REPRESENTATIVE: { label: "Representante", color: "#f97316" },
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

  const totalGross = salesBySource.reduce((sum, s) => sum + s.grossRevenue, 0);
  const sorted = [...salesBySource]
    .map((s) => ({ ...s, percentage: totalGross > 0 ? (s.grossRevenue / totalGross) * 100 : 0 }))
    .sort((a, b) => b.grossRevenue - a.grossRevenue);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Radio className="h-4 w-4 text-bee-gold" />
        <p className="text-sm font-semibold">Vendas por Origem</p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <Radio className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhum pedido no período</p>
        </div>
      ) : (
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
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: cfg.color + "26", color: cfg.color }}
                      >
                        {item.orders}
                      </span>
                    </div>
                    <span className="text-xs font-semibold w-10 text-right">{item.percentage.toFixed(1)}%</span>
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
      )}
    </div>
  );
}

const CHANNEL_CONFIG = {
  b2bDirect: { label: "B2B Direto", color: "#6366f1" },
  b2cDirect: { label: "B2C Direto", color: "#FBBD23" },
  representatives: { label: "Representantes", color: "#f97316" },
} as const;

type ChannelKey = keyof typeof CHANNEL_CONFIG;

function ChannelTooltip({ active, payload }: { active?: boolean; payload?: { payload: { key: ChannelKey; orders: number; percentage: number; grossRevenue: number; netRevenue: number; pendingCommission?: number; paidCommission?: number } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const cfg = CHANNEL_CONFIG[d.key];
  const hasCommission = d.key === "representatives" && (d.pendingCommission !== undefined || d.paidCommission !== undefined);
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs space-y-0.5">
      <p className="font-semibold mb-1.5" style={{ color: cfg.color }}>{cfg.label}</p>
      <p className="text-muted-foreground">{d.orders} pedido{d.orders !== 1 ? "s" : ""} · <span className="font-medium text-foreground">{d.percentage.toFixed(1)}%</span></p>
      <p>Bruto: <span className="font-medium">{formatCurrency(d.grossRevenue)}</span></p>
      <p>Líquido: <span className="font-medium text-emerald-600">{formatCurrency(d.netRevenue)}</span></p>
      {hasCommission && (
        <>
          <p className="pt-1 border-t">Comissões Pendentes: <span className="font-medium text-amber-600">{formatCurrency(d.pendingCommission ?? 0)}</span></p>
          <p>Comissões Pagas (período): <span className="font-medium text-emerald-600">{formatCurrency(d.paidCommission ?? 0)}</span></p>
        </>
      )}
    </div>
  );
}

function ChannelBreakdownRow({ label, breakdown, color }: { label: string; breakdown: ChannelBreakdown; color: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground pl-5">
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: color, opacity: 0.6 }} />
      <span className="font-medium text-foreground">{label}</span>
      <span>{breakdown.totalOrders} pedido{breakdown.totalOrders !== 1 ? "s" : ""}</span>
      <span>Bruto: <span className="font-medium text-foreground">{formatCurrency(breakdown.grossRevenue)}</span></span>
      <span>Líquido: <span className="font-medium text-emerald-600">{formatCurrency(breakdown.netRevenue)}</span></span>
      <span>{breakdown.totalCustomers} cliente{breakdown.totalCustomers !== 1 ? "s" : ""}</span>
    </div>
  );
}

function TopRepresentativesCard({ representatives, activeCount, isLoading }: { representatives: TopRepresentative[]; activeCount: number; isLoading: boolean }) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-44 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (representatives.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-4 w-4 text-orange-500" />
          <p className="text-sm font-semibold">Top Representantes</p>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
          <Users className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhuma venda via representante no período</p>
        </div>
      </div>
    );
  }

  const hasMore = representatives.length > COLLAPSED_COUNT;
  const visible = expanded ? representatives : representatives.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-orange-500" />
          <p className="text-sm font-semibold">Top Representantes</p>
        </div>
        <span className="text-xs text-muted-foreground">{activeCount} ativo{activeCount !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-3">
        {visible.map((rep, i) => (
          <div key={rep.id} className="flex items-start gap-2.5">
            <span className="text-xs font-bold text-muted-foreground w-4 pt-0.5 text-right shrink-0">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold truncate">{rep.name}</span>
                <span className="text-xs font-semibold text-emerald-600 shrink-0 ml-2">{formatCurrency(rep.grossRevenue)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{rep.totalOrders} pedido{rep.totalOrders !== 1 ? "s" : ""}</span>
                <span>{rep.totalCustomers} cliente{rep.totalCustomers !== 1 ? "s" : ""}</span>
                <span>Líq. {formatCurrency(rep.netRevenue)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 h-auto py-1 text-xs text-muted-foreground gap-1 self-center"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3" /> Ver menos</>
          ) : (
            <><ChevronDown className="h-3 w-3" /> Ver todos ({representatives.length})</>
          )}
        </Button>
      )}
    </div>
  );
}

function ChannelCard({ channels, isLoading }: { channels: DashboardChannels | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-40 mb-5" />
        <div className="flex flex-col sm:flex-row gap-6">
          <Skeleton className="h-40 w-full sm:w-44 rounded-full mx-auto" />
          <div className="flex-1 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
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

  const totalOrders = (channels?.b2bDirect.totalOrders ?? 0) + (channels?.b2cDirect.totalOrders ?? 0) + (channels?.representatives.totalOrders ?? 0);
  const totalGrossRevenue = (channels?.b2bDirect.grossRevenue ?? 0) + (channels?.b2cDirect.grossRevenue ?? 0) + (channels?.representatives.grossRevenue ?? 0);

  const chartData = (["b2bDirect", "b2cDirect", "representatives"] as const).map((key) => {
    const ch = key === "b2bDirect" ? channels?.b2bDirect : key === "b2cDirect" ? channels?.b2cDirect : channels?.representatives;
    return {
      key,
      orders: ch?.totalOrders ?? 0,
      percentage: totalGrossRevenue > 0 ? ((ch?.grossRevenue ?? 0) / totalGrossRevenue) * 100 : 0,
      grossRevenue: ch?.grossRevenue ?? 0,
      netRevenue: ch?.netRevenue ?? 0,
      pendingCommission: key === "representatives" ? (channels?.representatives?.pendingCommission ?? 0) : undefined,
      paidCommission: key === "representatives" ? (channels?.representatives?.paidCommission ?? 0) : undefined,
    };
  });

  const getBreakdown = (key: ChannelKey): ChannelBreakdown => {
    if (!channels) return { totalOrders: 0, grossRevenue: 0, netRevenue: 0, avgOrderValue: 0, totalCustomers: 0, newCustomers: 0 };
    if (key === "b2bDirect") return channels.b2bDirect;
    if (key === "b2cDirect") return channels.b2cDirect;
    return channels.representatives;
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="h-4 w-4 text-bee-gold" />
        <p className="text-sm font-semibold">Vendas por Canal</p>
      </div>

      {!channels || totalOrders === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhum pedido no período</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Donut */}
          <div className="w-44 shrink-0">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="percentage"
                  nameKey="key"
                  innerRadius={48}
                  outerRadius={72}
                  strokeWidth={2}
                  stroke="hsl(var(--card))"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={CHANNEL_CONFIG[entry.key].color} />
                  ))}
                </Pie>
                <Tooltip content={<ChannelTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* List */}
          <div className="flex-1 w-full space-y-4">
            {chartData.map((item) => {
              const cfg = CHANNEL_CONFIG[item.key];
              const ch = getBreakdown(item.key);
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                      <span className="text-xs font-semibold">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="text-muted-foreground">{item.orders} pedido{item.orders !== 1 ? "s" : ""}</span>
                      <span className="font-semibold w-10 text-right">{item.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1.5">
                    <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: cfg.color }} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground pl-3.5">
                    <span>Bruto: <span className="font-medium text-foreground">{formatCurrency(ch.grossRevenue)}</span></span>
                    <span>Líquido: <span className="font-medium text-emerald-600">{formatCurrency(ch.netRevenue)}</span></span>
                    <span>Ticket médio: <span className="font-medium text-foreground">{formatCurrency(ch.avgOrderValue)}</span></span>
                    <span>{ch.totalCustomers} cliente{ch.totalCustomers !== 1 ? "s" : ""} · <span className="font-medium text-foreground">+{ch.newCustomers} novo{ch.newCustomers !== 1 ? "s" : ""}</span></span>
                  </div>
                  {/* B2B sub-breakdowns */}
                  {item.key === "b2bDirect" && channels.b2bDirect.totalOrders > 0 && (
                    <div className="space-y-1 mt-1">
                      <ChannelBreakdownRow label="Lojistas" breakdown={channels.b2bDirect.retailers} color={cfg.color} />
                      <ChannelBreakdownRow label="Distribuidores" breakdown={channels.b2bDirect.distributors} color={cfg.color} />
                    </div>
                  )}
                  {/* Representatives commission breakdown */}
                  {item.key === "representatives" && (channels.representatives.pendingCommission > 0 || channels.representatives.paidCommission > 0) && (
                    <div className="space-y-1 mt-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground pl-5">
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color, opacity: 0.6 }} />
                        <span className="font-medium text-foreground">Comissões Pendentes</span>
                        <span className="font-medium text-amber-600">{formatCurrency(channels.representatives.pendingCommission)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground pl-5">
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color, opacity: 0.6 }} />
                        <span className="font-medium text-foreground">Comissões Pagas (período)</span>
                        <span className="font-medium text-emerald-600">{formatCurrency(channels.representatives.paidCommission)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function GiftsCard({ gifts, isLoading }: { gifts: GiftMetrics | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="flex gap-6 mb-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalGifts = gifts?.totalGiftsGiven ?? 0;
  const totalCost = gifts?.totalGiftCost ?? 0;
  const byTier = gifts?.byTier ?? [];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-4 w-4 text-violet-500" />
        <p className="text-sm font-semibold">Brindes nas Compras</p>
      </div>

      {totalGifts === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center gap-2">
          <Gift className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhum brinde dado no período</p>
        </div>
      ) : (
        <>
          <div className="flex gap-6 mb-5">
            <div>
              <p className="text-2xl font-bold">{totalGifts}</p>
              <p className="text-xs text-muted-foreground">brinde{totalGifts !== 1 ? "s" : ""} entregue{totalGifts !== 1 ? "s" : ""}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-600">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-muted-foreground">custo total</p>
            </div>
          </div>

          {byTier.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Por tipo de brinde</p>
              {byTier.map((tier) => (
                <div key={tier.tierName} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span className="truncate text-muted-foreground">{tier.tierName}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="font-medium">{tier.count}×</span>
                    <span className="text-muted-foreground w-24 text-right">{formatCurrency(tier.totalCost)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface DashboardSalesSectionProps {
  data: DashboardSales | undefined;
  channels: DashboardChannels | undefined;
  isLoading: boolean;
}

export function DashboardSalesSection({ data, channels, isLoading }: DashboardSalesSectionProps) {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesBySourceCard salesBySource={data?.salesBySource ?? []} isLoading={isLoading} />
        <ChannelCard channels={channels} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopRepresentativesCard
          representatives={channels?.representatives.topRepresentatives ?? []}
          activeCount={channels?.representatives.activeRepresentatives ?? 0}
          isLoading={isLoading}
        />
        <GiftsCard gifts={data?.gifts} isLoading={isLoading} />
      </div>
    </section>
  );
}

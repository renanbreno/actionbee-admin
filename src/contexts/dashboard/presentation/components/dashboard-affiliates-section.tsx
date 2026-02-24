"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Medal,
  Tag,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  Ticket,
  ShoppingCart,
  Gift,
  DollarSign,
  TrendingUp,
  Percent,
  Gift as GiftIcon,
  BarChart3,
} from "lucide-react";
import {
  DashboardAffiliates,
  TopAffiliate,
  CouponUsage,
  TopAffiliateCategory,
} from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  formatCurrency as formatAffiliateCurrency,
  formatNumber,
} from "../utils/formatters";

interface PillProps {
  count: number;
  label?: string;
}

function CountPill({ count }: PillProps) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
      {count}
    </span>
  );
}

function formatCurrency(value: number | undefined): string {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPercent(value: number): string {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

function TopAffiliatesList({
  affiliates,
  isLoading,
}: {
  affiliates: TopAffiliate[];
  isLoading: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b lg:border-b-0">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="px-4 pb-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b lg:border-b-0">
        <div className="flex items-center gap-2">
          <Medal className="h-4 w-4 text-bee-gold" />
          <p className="text-sm font-semibold">Top Afiliados</p>
          <span className="text-xs text-muted-foreground">
            ({affiliates.length})
          </span>
        </div>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="lg:hidden p-1 hover:bg-muted/50 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Mobile: collapsible, Desktop: always visible */}
      <div
        className={`${isExpanded ? "block" : "hidden"} lg:block max-h-64 lg:max-h-80 overflow-y-auto px-4 pt-4 pb-4 flex-1`}
      >
        {affiliates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum afiliado com pedidos no período.
          </p>
        ) : (
          <div className="divide-y">
            {affiliates.map((a, i) => (
              <div
                key={`${a.name}-${i}`}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-medium truncate">{a.name}</p>
                    <CountPill count={a.orders} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {a.totalGrossRevenue > 0 || a.totalNetRevenue > 0 ? (
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80 font-medium leading-none pb-1">
                          Venda Bruta
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">
                          {formatCurrency(a.totalGrossRevenue)}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-600/80 font-medium leading-none pb-1">
                          Venda Líquida
                        </p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 leading-none">
                          {formatCurrency(a.totalNetRevenue)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(a.commissionEarned)}
                    </p>
                  )}
                  {a.avgCommissionRate > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-end gap-1">
                      <Tag className="h-2.5 w-2.5" />
                      <span>
                        Comissão {formatCurrency(a.commissionEarned)} (
                        {formatPercent(a.avgCommissionRate)})
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CouponUsageList({
  coupons,
  isLoading,
}: {
  coupons: CouponUsage[];
  isLoading: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b lg:border-b-0">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="px-4 pb-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b lg:border-b-0">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-violet-600" />
          <p className="text-sm font-semibold">Cupons Mais Usados</p>
          <span className="text-xs text-muted-foreground">
            ({coupons.length})
          </span>
        </div>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="lg:hidden p-1 hover:bg-muted/50 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Mobile: collapsible, Desktop: always visible */}
      <div
        className={`${isExpanded ? "block" : "hidden"} lg:block max-h-64 lg:max-h-80 overflow-y-auto px-4 pt-4 pb-4 flex-1`}
      >
        {coupons.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum cupom utilizado no período.
          </p>
        ) : (
          <div className="divide-y">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate">{c.code}</span>
                  <CountPill count={c.usedCount} />
                </div>
                <p className="text-sm font-semibold text-emerald-600 shrink-0">
                  -{formatCurrency(c.totalDiscount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TopCategoriesList({
  categories,
  isLoading,
}: {
  categories: TopAffiliateCategory[];
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const COLLAPSED_COUNT = 5;
  const hasMore = categories.length > COLLAPSED_COUNT;
  const visible = expanded ? categories : categories.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-blue-600" />
          <p className="text-sm font-semibold">Top Categorias de Afiliado</p>
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-0.5 px-2 text-xs text-muted-foreground gap-1"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Ver todos (
                {categories.length})
              </>
            )}
          </Button>
        )}
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhuma categoria de afiliado com pedidos no período.
        </p>
      ) : (
        <div className="divide-y">
          {visible.map((c, i) => (
            <div
              key={c.categoryId}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {c.categoryName}
                  </p>
                  <CountPill count={c.orders} />
                </div>
              </div>
              <div className="text-right shrink-0">
                {c.totalGrossRevenue > 0 || c.totalNetRevenue > 0 ? (
                  <div className="flex items-center justify-end gap-2">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80 font-medium leading-none pb-1">
                        Venda Bruta
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">
                        {formatCurrency(c.totalGrossRevenue)}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-emerald-600/80 font-medium leading-none pb-1">
                        Venda Líquida
                      </p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 leading-none">
                        {formatCurrency(c.totalNetRevenue)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(c.totalGrossRevenue)}
                  </p>
                )}
                {c.avgCommissionRate > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-end gap-1">
                    <Tag className="h-2.5 w-2.5" />
                    <span>
                      Comissão {formatCurrency(c.totalCommission)} (
                      {formatPercent(c.avgCommissionRate)})
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DashboardAffiliatesSectionProps {
  data: DashboardAffiliates | undefined;
  isLoading: boolean;
}

export function DashboardAffiliatesSection({
  data,
  isLoading,
}: DashboardAffiliatesSectionProps) {
  // Calcular métricas derivadas
  const totalDiscountGranted = isLoading
    ? 0
    : (data?.totalGrossRevenue ?? 0) - (data?.totalNetRevenue ?? 0);

  const totalGiftCost = isLoading
    ? 0
    : data?.shipmentMetrics?.reduce((sum, s) => sum + (s.totalCost ?? 0), 0) ?? 0;

  const averageTicket = isLoading
    ? 0
    : data?.totalOrdersWithCommission && data.totalOrdersWithCommission > 0
      ? (data?.totalNetRevenue ?? 0) / data.totalOrdersWithCommission
      : 0;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
          <Medal className="h-4 w-4 text-amber-600" />
        </div>
        <h2 className="text-base font-semibold">Afiliados & Comissões</h2>
      </div>

      {/* Métricas Financeiras */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <DollarSign className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-medium text-muted-foreground">Financeiro</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <DashboardMetricCard
            title="Comissões Pendentes"
            value={isLoading ? "—" : formatCurrency(data?.totalCommissionPending ?? data?.pendingCommission ?? 0)}
            icon={Clock}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-500/10"
            subtitle="aguardando pagamento"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Comissões Pagas"
            value={isLoading ? "—" : formatCurrency(data?.totalCommissionPaid ?? data?.paidCommission ?? 0)}
            icon={CheckCircle2}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-500/10"
            subtitle="pagas no período"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Receita Bruta"
            value={isLoading ? "—" : formatAffiliateCurrency(data?.totalGrossRevenue ?? 0)}
            icon={DollarSign}
            iconColor="text-slate-600"
            iconBgColor="bg-slate-500/10"
            subtitle="antes dos descontos"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Receita Líquida"
            value={isLoading ? "—" : formatAffiliateCurrency(data?.totalNetRevenue ?? 0)}
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-500/10"
            subtitle="após descontos"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Desconto Total Concedido"
            value={isLoading ? "—" : formatCurrency(totalDiscountGranted)}
            icon={Percent}
            iconColor="text-orange-500"
            iconBgColor="bg-orange-500/10"
            subtitle="via cupons de afiliado"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-muted-foreground">Operacional</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <DashboardMetricCard
            title="Ticket Médio"
            value={isLoading ? "—" : formatCurrency(averageTicket)}
            icon={BarChart3}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-500/10"
            subtitle="por pedido com comissão"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Total Afiliados"
            value={isLoading ? "—" : formatNumber(data?.totalAffiliates ?? 0)}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-500/10"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Cupons Ativos"
            value={isLoading ? "—" : formatNumber(data?.totalActiveCoupons ?? 0)}
            icon={Ticket}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-500/10"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Pedidos com Comissão"
            value={isLoading ? "—" : formatNumber(data?.totalOrdersWithCommission ?? 0)}
            icon={ShoppingCart}
            iconColor="text-bee-gold"
            iconBgColor="bg-bee-gold/10"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Custo de Brindes"
            value={isLoading ? "—" : formatCurrency(totalGiftCost)}
            icon={GiftIcon}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-500/10"
            subtitle="no período"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Shipments summary */}
      {data?.shipmentMetrics && data.shipmentMetrics.length > 0 && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-bee-gold" />
              <p className="text-sm font-semibold">Resumo de Remessas</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/dashboard/affiliates/bonificacoes">Ver todas</Link>
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {data.shipmentMetrics.slice(0, 5).map((shipment) => (
              <div
                key={shipment.affiliateId}
                className="flex items-center justify-between gap-3 py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {shipment.affiliateName}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {shipment.totalShipments} remessa
                    {shipment.totalShipments !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-muted-foreground">
                    {shipment.totalItemsSent} itens
                  </span>
                  <span className="text-sm font-medium">
                    {formatAffiliateCurrency(shipment.totalCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        <TopAffiliatesList
          affiliates={data?.topAffiliates ?? []}
          isLoading={isLoading}
        />
        <CouponUsageList
          coupons={data?.couponUsage ?? []}
          isLoading={isLoading}
        />
      </div>

      <TopCategoriesList
        categories={data?.topCategories ?? []}
        isLoading={isLoading}
      />
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Medal,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { DashboardVendedores, TopVendedor } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function formatCurrency(value: number): string {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function TopVendedoresList({
  vendedores,
  isLoading,
}: {
  vendedores: TopVendedor[];
  isLoading: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b lg:border-b-0">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="px-4 pb-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-24" />
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
          <p className="text-sm font-semibold">Top Vendedores</p>
          <span className="text-xs text-muted-foreground">({vendedores.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs hidden lg:flex" asChild>
            <Link href="/dashboard/vendedores">Ver todos</Link>
          </Button>
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
      </div>

      <div
        className={`${isExpanded ? "block" : "hidden"} lg:block max-h-64 lg:max-h-80 overflow-y-auto px-4 pt-4 pb-4 flex-1`}
      >
        {vendedores.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum vendedor com pedidos no período.
          </p>
        ) : (
          <div className="divide-y">
            {vendedores.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-medium truncate">{v.name}</p>
                    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
                      {v.orders}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-2">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80 font-medium leading-none pb-1">
                        Venda Bruta
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">
                        {formatCurrency(v.grossRevenue)}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-emerald-600/80 font-medium leading-none pb-1">
                        Venda Líquida
                      </p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 leading-none">
                        {formatCurrency(v.netRevenue)}
                      </p>
                    </div>
                  </div>
                  {v.commissionGenerated > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      Comissão: {formatCurrency(v.commissionGenerated)}
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

interface DashboardVendedoresSectionProps {
  data: DashboardVendedores | undefined;
  isLoading: boolean;
}

export function DashboardVendedoresSection({
  data,
  isLoading,
}: DashboardVendedoresSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold">Vendedores & Comissões</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <Link href="/dashboard/vendedores">Ver detalhes</Link>
        </Button>
      </div>

      {/* Métricas de vendas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
        <DashboardMetricCard
          title="Total Vendedores"
          value={isLoading ? "—" : String(data?.totalVendedores ?? 0)}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-500/10"
          isLoading={isLoading}
        />
        <DashboardMetricCard
          title="Pedidos com Vendedor"
          value={isLoading ? "—" : String(data?.totalOrdersWithVendedor ?? 0)}
          icon={ShoppingCart}
          iconColor="text-bee-gold"
          iconBgColor="bg-bee-gold/10"
          subtitle="no período"
          isLoading={isLoading}
        />
        <DashboardMetricCard
          title="Receita Bruta"
          value={isLoading ? "—" : formatCurrency(data?.totalGrossRevenue ?? 0)}
          icon={DollarSign}
          iconColor="text-slate-600"
          iconBgColor="bg-slate-500/10"
          subtitle="gerada por vendedores"
          isLoading={isLoading}
        />
        <DashboardMetricCard
          title="Receita Líquida"
          value={isLoading ? "—" : formatCurrency(data?.totalNetRevenue ?? 0)}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-500/10"
          subtitle="gerada por vendedores"
          isLoading={isLoading}
        />
      </div>

      {/* Métricas de comissão */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <DashboardMetricCard
          title="Comissão Gerada"
          value={isLoading ? "—" : formatCurrency(data?.totalCommissionGenerated ?? 0)}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-500/10"
          subtitle="no período"
          isLoading={isLoading}
        />
        <DashboardMetricCard
          title="Comissão Pendente"
          value={isLoading ? "—" : formatCurrency(data?.totalCommissionPending ?? 0)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-500/10"
          subtitle="aguardando pagamento"
          isLoading={isLoading}
        />
        <DashboardMetricCard
          title="Comissão Paga"
          value={isLoading ? "—" : formatCurrency(data?.totalCommissionPaid ?? 0)}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-500/10"
          subtitle="paga no período"
          isLoading={isLoading}
        />
      </div>

      {/* Top Vendedores */}
      <TopVendedoresList
        vendedores={data?.topVendedores ?? []}
        isLoading={isLoading}
      />
    </section>
  );
}

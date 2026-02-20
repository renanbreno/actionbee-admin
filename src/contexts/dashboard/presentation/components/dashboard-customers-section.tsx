"use client";

import { useState } from "react";
import { Users, UserPlus, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardCustomers, TopCustomer } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const COLLAPSED_COUNT = 5;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TopCustomersTable({
  customers,
  isLoading,
}: {
  customers: TopCustomer[];
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasMore = customers.length > COLLAPSED_COUNT;
  const visible = expanded ? customers : customers.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold">Top Clientes</p>
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
              <><ChevronDown className="h-3 w-3" /> Ver todos ({customers.length})</>
            )}
          </Button>
        )}
      </div>
      {customers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhum cliente no período.
        </p>
      ) : (
        <div className="divide-y">
          {visible.map((c, i) => (
            <div key={c.email} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{formatCurrency(c.totalSpent)}</p>
                <p className="text-xs text-muted-foreground">
                  {c.orderCount} pedido{c.orderCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DashboardCustomersSectionProps {
  data: DashboardCustomers | undefined;
  isLoading: boolean;
}

export function DashboardCustomersSection({ data, isLoading }: DashboardCustomersSectionProps) {
  const metrics = [
    {
      title: "Total de Clientes",
      value: isLoading ? "—" : String(data?.totalCustomers ?? 0),
      icon: Users,
      iconColor: "text-bee-gold",
      iconBgColor: "bg-bee-gold/10",
    },
    {
      title: "Novos no Período",
      value: isLoading ? "—" : String(data?.newCustomers ?? 0),
      icon: UserPlus,
      iconColor: "text-emerald-600",
      iconBgColor: "bg-emerald-500/10",
    },
    {
      title: "Clientes Ativos",
      value: isLoading ? "—" : String(data?.activeCustomers ?? 0),
      icon: UserCheck,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-500/10",
      subtitle: "com pedido no período",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
          <Users className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold">Clientes</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <div key={m.title} className={i === metrics.length - 1 ? "col-span-2 sm:col-span-1" : ""}>
            <DashboardMetricCard {...m} isLoading={isLoading} />
          </div>
        ))}
      </div>

      <TopCustomersTable customers={data?.topCustomers ?? []} isLoading={isLoading} />
    </section>
  );
}

"use client";

import { useState } from "react";
import { Package, PackageX, AlertTriangle, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardProducts, LowStockProduct, TopSellingItem } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const COLLAPSED_COUNT = 5;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function LowStockList({
  products,
  isLoading,
}: {
  products: LowStockProduct[];
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasMore = products.length > COLLAPSED_COUNT;
  const visible = expanded ? products : products.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-semibold">Estoque Baixo</p>
        {products.length > 0 && (
          <Badge variant="secondary" className="text-amber-700 bg-amber-100">
            {products.length}
          </Badge>
        )}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-0.5 px-2 text-xs text-muted-foreground gap-1 ml-auto"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <><ChevronUp className="h-3 w-3" /> Ver menos</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> Ver todos ({products.length})</>
            )}
          </Button>
        )}
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Todos os produtos com estoque adequado.
        </p>
      ) : (
        <div className="divide-y">
          {visible.map((p) => (
            <div
              key={p.productId}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <p className="text-sm truncate">{p.productName}</p>
              <Badge
                className={
                  p.stockUnits === 0
                    ? "bg-red-100 text-red-700 shrink-0"
                    : "bg-amber-100 text-amber-700 shrink-0"
                }
              >
                {p.stockUnits === 0 ? "Sem estoque" : `${p.stockUnits} un.`}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopSellingList({
  items,
  isLoading,
}: {
  items: TopSellingItem[];
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
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasMore = items.length > COLLAPSED_COUNT;
  const visible = expanded ? items : items.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-bee-gold" />
          <p className="text-sm font-semibold">Mais Vendidos</p>
        </div>
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
              <><ChevronDown className="h-3 w-3" /> Ver todos ({items.length})</>
            )}
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhuma venda no período.
        </p>
      ) : (
        <div className="divide-y">
          {visible.map((item, i) => (
            <div
              key={`${item.productName}-${item.variantName}`}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.variantName}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{item.quantity} un.</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(item.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DashboardProductsSectionProps {
  data: DashboardProducts | undefined;
  isLoading: boolean;
}

export function DashboardProductsSection({ data, isLoading }: DashboardProductsSectionProps) {
  const metrics = [
    {
      title: "Produtos Ativos",
      value: isLoading ? "—" : String(data?.totalActive ?? 0),
      icon: Package,
      iconColor: "text-emerald-600",
      iconBgColor: "bg-emerald-500/10",
    },
    {
      title: "Produtos Inativos",
      value: isLoading ? "—" : String(data?.totalInactive ?? 0),
      icon: PackageX,
      iconColor: "text-muted-foreground",
      iconBgColor: "bg-muted",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
          <Package className="h-4 w-4 text-emerald-600" />
        </div>
        <h2 className="text-base font-semibold">Produtos</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        {metrics.map((m) => (
          <DashboardMetricCard key={m.title} {...m} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LowStockList products={data?.lowStock ?? []} isLoading={isLoading} />
        <TopSellingList items={data?.topSelling ?? []} isLoading={isLoading} />
      </div>
    </section>
  );
}

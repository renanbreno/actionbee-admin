"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Medal, Tag, LayoutGrid, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardAffiliates, TopAffiliate, CouponUsage, TopAffiliateCategory } from "../../domain/entities/dashboard";
import { DashboardMetricCard } from "./dashboard-metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const COLLAPSED_COUNT = 5;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TopAffiliatesList({
  affiliates,
  isLoading,
}: {
  affiliates: TopAffiliate[];
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
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasMore = affiliates.length > COLLAPSED_COUNT;
  const visible = expanded ? affiliates : affiliates.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Medal className="h-4 w-4 text-bee-gold" />
          <p className="text-sm font-semibold">Top Afiliados</p>
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
              <><ChevronDown className="h-3 w-3" /> Ver todos ({affiliates.length})</>
            )}
          </Button>
        )}
      </div>
      {affiliates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhum afiliado com pedidos no período.
        </p>
      ) : (
        <div className="divide-y">
          {visible.map((a, i) => (
            <div
              key={a.name}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <p className="text-sm font-medium truncate">{a.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{formatCurrency(a.commissionEarned)}</p>
                <p className="text-xs text-muted-foreground">
                  {a.orders} pedido{a.orders !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="space-y-3">
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

  const hasMore = coupons.length > COLLAPSED_COUNT;
  const visible = expanded ? coupons : coupons.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-violet-600" />
          <p className="text-sm font-semibold">Cupons Mais Usados</p>
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
              <><ChevronDown className="h-3 w-3" /> Ver todos ({coupons.length})</>
            )}
          </Button>
        )}
      </div>
      {coupons.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhum cupom utilizado no período.
        </p>
      ) : (
        <div className="divide-y">
          {visible.map((c) => (
            <div
              key={c.code}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-semibold">
                  {c.code}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {c.usedCount}× uso{c.usedCount !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-600 shrink-0">
                -{formatCurrency(c.totalDiscount)}
              </p>
            </div>
          ))}
        </div>
      )}
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
  const [expanded, setExpanded] = useState(false);

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
              <><ChevronUp className="h-3 w-3" /> Ver menos</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> Ver todos ({categories.length})</>
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
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <p className="text-sm font-medium truncate">{c.categoryName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{formatCurrency(c.revenue)}</p>
                <p className="text-xs text-muted-foreground">
                  {c.orders} pedido{c.orders !== 1 ? "s" : ""} · comissão {formatCurrency(c.commissionEarned)}
                </p>
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

export function DashboardAffiliatesSection({ data, isLoading }: DashboardAffiliatesSectionProps) {
  const metrics = [
    {
      title: "Comissões Pendentes",
      value: isLoading ? "—" : formatCurrency(data?.pendingCommission ?? 0),
      icon: Clock,
      iconColor: "text-amber-600",
      iconBgColor: "bg-amber-500/10",
      subtitle: "aguardando pagamento",
    },
    {
      title: "Comissões Pagas",
      value: isLoading ? "—" : formatCurrency(data?.paidCommission ?? 0),
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBgColor: "bg-emerald-500/10",
      subtitle: "pagas no período",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
          <Medal className="h-4 w-4 text-amber-600" />
        </div>
        <h2 className="text-base font-semibold">Afiliados & Comissões</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-lg">
        {metrics.map((m) => (
          <DashboardMetricCard key={m.title} {...m} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopAffiliatesList affiliates={data?.topAffiliates ?? []} isLoading={isLoading} />
        <CouponUsageList coupons={data?.couponUsage ?? []} isLoading={isLoading} />
      </div>

      <TopCategoriesList categories={data?.topCategories ?? []} isLoading={isLoading} />
    </section>
  );
}

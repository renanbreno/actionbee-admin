"use client";

import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { CommissionSummary } from "../../domain/entities/commission";
import { Skeleton } from "@/components/ui/skeleton";

interface CommissionSummaryCardsProps {
  summary: CommissionSummary | undefined;
  isLoading: boolean;
}

export function CommissionSummaryCards({ summary, isLoading }: CommissionSummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-8 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Vendas (Líquido)",
      value: `R$ ${summary.totalDiscountedAmount.toFixed(2).replace(".", ",")}`,
      icon: DollarSign,
      color: "text-bee-gold",
      bgColor: "bg-bee-gold/10",
    },
    {
      title: "Comissões Totais",
      value: `R$ ${summary.totalCommissionAmount.toFixed(2).replace(".", ",")}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "A Pagar",
      value: `R$ ${summary.pendingCommissionAmount.toFixed(2).replace(".", ",")}`,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Pago",
      value: `R$ ${summary.paidCommissionAmount.toFixed(2).replace(".", ",")}`,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-lg sm:text-xl font-bold">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

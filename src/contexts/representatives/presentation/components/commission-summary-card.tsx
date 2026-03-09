"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Clock, CheckCircle } from "lucide-react";
import { CommissionSummary } from "../../domain/entities/commission-summary";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface CommissionSummaryCardProps {
  summary: CommissionSummary;
  isLoading?: boolean;
  showCard?: boolean;
}

export function CommissionSummaryCard({ summary, isLoading, showCard = true }: CommissionSummaryCardProps) {
  const content = (
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bee-gold/10">
          <Wallet className="h-4 w-4 text-bee-gold" />
        </div>
        <p className="text-sm text-muted-foreground">Comissões</p>
      </div>
      {isLoading ? (
        <div className="h-6 w-20 animate-pulse rounded bg-muted" />
      ) : (
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold leading-none">
            {formatCurrency(summary.totalCommissions)}
          </p>
        </div>
      )}
      <div className="mt-2 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendentes
          </span>
          <span className="font-medium">{formatCurrency(summary.pendingCommissions)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            Pagas
          </span>
          <span className="font-medium text-green-600">{formatCurrency(summary.paidCommissions)}</span>
        </div>
      </div>
    </CardContent>
  );

  if (!showCard) {
    return content;
  }

  return <Card className="shadow-sm">{content}</Card>;
}

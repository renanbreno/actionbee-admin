"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { SalesReportSummary as SalesReportSummaryType } from "../../domain/entities/sales-report";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface SalesReportSummaryProps {
  summary: SalesReportSummaryType;
  isLoading?: boolean;
  children?: React.ReactNode;
}

function RevenueCard({
  grossRevenue,
  netRevenue,
  isLoading,
}: {
  grossRevenue: number;
  netRevenue: number;
  isLoading?: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bee-gold/10 shrink-0">
            <DollarSign className="h-5 w-5 text-bee-gold" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            {isLoading ? (
              <>
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Receita</p>
                <div>
                  <p className="text-xs text-muted-foreground">Bruta</p>
                  <p className="text-lg font-semibold">{formatCurrency(grossRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Líquida (após descontos)</p>
                  <p className="text-lg font-semibold">{formatCurrency(netRevenue)}</p>
                </div>
                <p className="text-[10px] text-muted-foreground/70 leading-tight">
                  * Não inclui comissões de representantes
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesReportSummary({ summary, isLoading, children }: SalesReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <RevenueCard
        grossRevenue={summary.grossRevenue}
        netRevenue={summary.netRevenue}
        isLoading={isLoading}
      />
      {children}
    </div>
  );
}

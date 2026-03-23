"use client";

import { useState } from "react";
import { Gift, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/ui/month-picker";
import { useMonthlyReport } from "@/contexts/affiliate-shipments/presentation/hooks/use-monthly-report";
import { MonthlyReportTable } from "@/contexts/affiliate-shipments/presentation/components/monthly-report-table";
import { CreateShipmentDialog } from "@/contexts/affiliate-shipments/presentation/components/create-shipment-dialog";

// Helper to get current month in local timezone (not UTC)
const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export default function BonificacoesPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: report, isLoading } = useMonthlyReport(month);

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Bonificações
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie os envios mensais de produtos para afiliados
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Lançar nova bonificação
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 w-48">
        <Label className="text-sm whitespace-nowrap">Mês:</Label>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {/* Report */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório do Mês</CardTitle>
          <CardDescription>
            Resumo consolidado de envios e custos por afiliado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-48 rounded-lg" />
            </div>
          ) : report ? (
            <MonthlyReportTable report={report} />
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum envio registrado neste mês.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateDialogOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Lançar nova bonificação"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <CreateShipmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { LayoutDashboard, RefreshCw, AlertCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/auth/presentation/providers/auth-provider";
import { useDashboard } from "@/contexts/dashboard/presentation/hooks/use-dashboard";
import { DashboardSalesSection } from "@/contexts/dashboard/presentation/components/dashboard-sales-section";
import { DashboardCustomersSection } from "@/contexts/dashboard/presentation/components/dashboard-customers-section";
import { DashboardProductsSection } from "@/contexts/dashboard/presentation/components/dashboard-products-section";
import { DashboardAffiliatesSection } from "@/contexts/dashboard/presentation/components/dashboard-affiliates-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Gera os últimos 13 meses (incluindo o atual)
function generateMonthOptions() {
  const now = new Date();
  return Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const value = `${year}-${String(month).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return { value, month, year, label, isCurrent: i === 0 };
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

const MONTH_OPTIONS = generateMonthOptions();
const CURRENT_VALUE = MONTH_OPTIONS[0].value;

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [selectedValue, setSelectedValue] = useState(CURRENT_VALUE);

  const selected = MONTH_OPTIONS.find((o) => o.value === selectedValue) ?? MONTH_OPTIONS[0];
  const isCurrentMonth = selected.isCurrent;

  const { data, isLoading, isError, refetch, forceRefresh } = useDashboard(
    isCurrentMonth ? undefined : { month: selected.month, year: selected.year },
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10 shrink-0">
            <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {user ? `Bem-vindo, ${user.name}` : "Visão geral do negócio"}
              {data && (
                <span className="ml-1">
                  · <span className="font-medium text-foreground">
                    {formatDate(data.period.from)} – {formatDate(data.period.to)}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          {/* Seletor de mês */}
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.isCurrent ? `${opt.label} (atual)` : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isCurrentMonth && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">Erro ao carregar métricas</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verifique sua conexão e tente novamente.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-auto shrink-0">
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Sections */}
      <DashboardSalesSection data={data?.sales} isLoading={isLoading} />

      <Separator />

      <DashboardCustomersSection data={data?.customers} isLoading={isLoading} />

      <Separator />

      <DashboardProductsSection data={data?.products} isLoading={isLoading} />

      <Separator />

      <DashboardAffiliatesSection data={data?.affiliates} isLoading={isLoading} />

      {/* Footer */}
      {data && (
        <p className="text-center text-xs text-muted-foreground pb-4">
          {isCurrentMonth
            ? `Cache gerado em ${formatDateTime(data.generatedAt)} · Atualizado automaticamente a cada 5 min`
            : `Dados históricos de ${selected.label}`}
        </p>
      )}
    </div>
  );
}

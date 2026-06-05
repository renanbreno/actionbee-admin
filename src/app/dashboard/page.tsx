"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ShieldAlert, LogOut } from "lucide-react";
import { useAuthContext } from "@/contexts/auth/presentation/providers/auth-provider";
import { useLogout } from "@/contexts/auth/presentation/hooks/use-logout";
import { resolveLandingRoute } from "@/contexts/auth/domain/services/landing-route";
import { useDashboard } from "@/contexts/dashboard/presentation/hooks/use-dashboard";
import { DashboardSalesSection } from "@/contexts/dashboard/presentation/components/dashboard-sales-section";
import { DashboardCustomersSection } from "@/contexts/dashboard/presentation/components/dashboard-customers-section";
import { DashboardProductsSection } from "@/contexts/dashboard/presentation/components/dashboard-products-section";
import { DashboardAffiliatesSection } from "@/contexts/dashboard/presentation/components/dashboard-affiliates-section";
import { DashboardVendedoresSection } from "@/contexts/dashboard/presentation/components/dashboard-vendedores-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";

type PeriodType = "week" | "month" | "custom";

// Calcula o número da semana ISO (1-53)
function getISOWeek(d: Date): number {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayOfWeek = date.getDay() || 7;
  date.setDate(date.getDate() + 4 - dayOfWeek);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Formata o período atual para exibição
function formatPeriodLabel(period: PeriodType, offset: number, from?: string, to?: string): string {
  if (period === "custom" && from && to) {
    const fmt = (dateStr: string) => {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };
    return `${fmt(from)} – ${fmt(to)}`;
  }

  const now = new Date();

  if (period === "month") {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  } else {
    // Semana: de segunda a domingo
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - (offset * 7));

    // Encontra a segunda-feira desta semana
    const dayOfWeek = weekDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const from = new Date(weekDate);
    from.setDate(from.getDate() + daysToMonday);

    const to = offset === 0
      ? weekDate  // Semana atual vai até hoje
      : new Date(from);
    if (offset > 0) to.setDate(to.getDate() + 6);

    const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    return `${fmt(from)} – ${fmt(to)}`;
  }
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

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, user, hasPermission } = useAuthContext();
  const canView = hasPermission("dashboard:view");

  // Sem permissão para o consolidado de vendas: manda para a primeira tela
  // acessível (pedidos, etc.). Se não houver nenhuma, mostra "sem acesso".
  const landing = resolveLandingRoute(user);
  const shouldRedirect = !canView && !!landing && landing !== "/dashboard";

  useEffect(() => {
    if (!isLoading && shouldRedirect && landing) {
      router.replace(landing);
    }
  }, [isLoading, shouldRedirect, landing, router]);

  if (isLoading) return null;
  if (canView) return <DashboardPageContent />;
  if (shouldRedirect) return null;

  return <NoAccessMessage />;
}

function NoAccessMessage() {
  const router = useRouter();
  const logoutMutation = useLogout();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <ShieldAlert className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Sem acesso a nenhuma área</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Seu usuário ainda não possui permissões para acessar nenhuma tela.
          Solicite ao administrador que atribua um cargo com as permissões
          necessárias.
        </p>
      </div>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() =>
          logoutMutation.mutate(undefined, {
            onSuccess: () => router.push("/login"),
          })
        }
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}

function DashboardPageContent() {
  const { user } = useAuthContext();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [offset, setOffset] = useState(0);
  const [customFromDate, setCustomFromDate] = useState<string>("");
  const [customToDate, setCustomToDate] = useState<string>("");

  // Obtém o mês/semana baseado no offset
  const now = new Date();

  let apiParams: { period: PeriodType; week?: number; month?: number; year?: number; from?: string; to?: string };

  if (period === "custom" && customFromDate && customToDate) {
    apiParams = {
      period: "custom",
      from: customFromDate,
      to: customToDate,
    };
  } else if (period === "month") {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    apiParams = {
      period: "month",
      month: targetMonth.getMonth() + 1,
      year: targetMonth.getFullYear(),
    };
  } else {
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - (offset * 7));

    // Encontra a segunda-feira desta semana
    const dayOfWeek = weekDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayDate = new Date(weekDate);
    mondayDate.setDate(mondayDate.getDate() + daysToMonday);

    apiParams = {
      period: "week",
      week: getISOWeek(mondayDate),
      year: mondayDate.getFullYear(),
    };
  }

  const { data, isLoading, isError, refetch, forceRefresh } = useDashboard(apiParams);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isCurrent = period === "custom" ? false : offset === 0;
  const periodLabel = formatPeriodLabel(period, offset, customFromDate, customToDate);

  const handlePrevious = () => setOffset((prev) => prev + 1);
  const handleNext = () => setOffset((prev) => Math.max(0, prev - 1));

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    setOffset(0);
    if (newPeriod !== "custom") {
      setCustomFromDate("");
      setCustomToDate("");
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

        <div className="flex items-center gap-2 sm:shrink-0 flex-wrap">
          {/* Toggle Semana/Mês/Custom */}
          <div className="flex rounded-md border">
            <Button
              variant={period === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePeriodChange("week")}
              className="rounded-r-none"
            >
              Semana
            </Button>
            <Button
              variant={period === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePeriodChange("month")}
              className="rounded-none border-x"
            >
              Mês
            </Button>
            <Button
              variant={period === "custom" ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePeriodChange("custom")}
              className="rounded-l-none"
            >
              Customizado
            </Button>
          </div>

          {period === "custom" ? (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Dois datepickers para período customizado */}
              <div className="w-[140px]">
                <DatePicker
                  value={customFromDate}
                  onChange={setCustomFromDate}
                  placeholder="De"
                />
              </div>
              <span className="text-muted-foreground">–</span>
              <div className="w-[140px]">
                <DatePicker
                  value={customToDate}
                  onChange={setCustomToDate}
                  placeholder="Até"
                />
              </div>
            </div>
          ) : (
            /* Navegação para semana/mês */
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="rounded-r-none border-r"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1.5 text-sm font-medium min-w-[140px] text-center">
                {isCurrent ? `${periodLabel} (atual)` : periodLabel}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={offset === 0}
                className="rounded-l-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isCurrent && period !== "custom" && (
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
      <DashboardSalesSection data={data?.sales} channels={data?.channels} isLoading={isLoading} />

      <Separator />

      <DashboardCustomersSection data={data?.customers} isLoading={isLoading} />

      <Separator />

      <DashboardProductsSection data={data?.products} isLoading={isLoading} />

      <Separator />

      <DashboardAffiliatesSection data={data?.affiliates} isLoading={isLoading} />

      <Separator />

      <DashboardVendedoresSection data={data?.vendedores} isLoading={isLoading} />

      {/* Footer */}
      {data && (
        <p className="text-center text-xs text-muted-foreground pb-4">
          {period === "custom"
            ? `Período customizado: ${periodLabel}`
            : isCurrent
            ? `Cache gerado em ${formatDateTime(data.generatedAt)} · Atualizado automaticamente`
            : `Dados históricos de ${periodLabel}`}
        </p>
      )}
    </div>
  );
}

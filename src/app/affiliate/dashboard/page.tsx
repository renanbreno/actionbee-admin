'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AffiliateProtectedRoute } from '@/contexts/affiliate-auth/presentation/components/affiliate-protected-route';
import { useAffiliateAuthContext } from '@/contexts/affiliate-auth/presentation/providers/affiliate-auth-provider';
import { useAffiliateLogout } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-logout';
import { useAffiliatePath } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-path';
import { useMyCommissions } from '@/contexts/affiliate-portal/presentation/hooks/use-my-commissions';
import { useMyShipments } from '@/contexts/affiliate-portal/presentation/hooks/use-my-shipments';
import { CommissionsSummary } from '@/contexts/affiliate-portal/presentation/components/commissions-summary';
import { ShipmentsList } from '@/contexts/affiliate-portal/presentation/components/shipments-list';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp, Package } from 'lucide-react';

type Tab = 'commissions' | 'shipments';
type Period = 'month' | 'last-month' | '3months' | 'year' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  'month': 'Este mês',
  'last-month': 'Mês passado',
  '3months': 'Últimos 3 meses',
  'year': 'Este ano',
  'all': 'Tudo',
};

function getPeriodDates(period: Period): { startDate?: string; endDate?: string } {
  if (period === 'all') return {};

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: fmt(start), endDate: fmt(end) };
  }

  if (period === 'last-month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { startDate: fmt(start), endDate: fmt(end) };
  }

  if (period === '3months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: fmt(start), endDate: fmt(end) };
  }

  if (period === 'year') {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return { startDate: fmt(start), endDate: fmt(end) };
  }

  return {};
}

function AffiliateDashboardContent() {
  const { user } = useAffiliateAuthContext();
  const [activeTab, setActiveTab] = useState<Tab>('commissions');
  const [period, setPeriod] = useState<Period>('month');
  const [commissionsPage, setCommissionsPage] = useState(1);
  const [shipmentsPage, setShipmentsPage] = useState(1);
  const logoutMutation = useAffiliateLogout();
  const router = useRouter();
  const affiliatePath = useAffiliatePath();

  const dateFilter = getPeriodDates(period);

  const { data: commissionsData, isLoading: loadingCommissions } = useMyCommissions(commissionsPage, 20, dateFilter);
  const { data: shipments, isLoading: loadingShipments } = useMyShipments(shipmentsPage, 20, dateFilter);

  // Reset to page 1 when period changes
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    setCommissionsPage(1);
    setShipmentsPage(1);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push(affiliatePath('/login')),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bee-gold/20 text-bee-gold">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Portal do Afiliado</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      {/* Hero Welcome Section */}
      <div className="mx-auto max-w-2xl px-4 pt-6 pb-2">
        <div className="bg-gradient-to-r from-bee-gold/10 via-bee-gold/5 to-transparent rounded-2xl p-6 border border-bee-gold/10">
          <h1 className="text-2xl font-bold tracking-tight">Olá, {user?.name}! 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Aqui está o resumo do seu desempenho. Continue o excelente trabalho!
          </p>
        </div>
      </div>

      {/* Period filter */}
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x items-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground mr-1 tracking-wider">Período</span>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`snap-start whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                period === p
                  ? 'bg-bee-gold text-black shadow-sm scale-100'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground scale-95 hover:scale-100'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs - Pill style */}
      <div className="mx-auto max-w-2xl px-4 mt-4">
        <div className="flex p-1 space-x-1 bg-muted/40 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('commissions')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === 'commissions'
                ? 'bg-background shadow-sm text-foreground ring-1 ring-black/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <TrendingUp className={`h-4 w-4 ${activeTab === 'commissions' ? 'text-bee-gold' : ''}`} />
            Comissões
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === 'shipments'
                ? 'bg-background shadow-sm text-foreground ring-1 ring-black/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <Package className={`h-4 w-4 ${activeTab === 'shipments' ? 'text-bee-gold' : ''}`} />
            Bonificações
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {activeTab === 'commissions' && (
          <>
            {loadingCommissions ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-bee-gold/20 border-t-bee-gold" />
              </div>
            ) : commissionsData ? (
              <CommissionsSummary
                data={commissionsData}
                currentPage={commissionsPage}
                limit={20}
                onPageChange={setCommissionsPage}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Erro ao carregar comissões.</p>
            )}
          </>
        )}

        {activeTab === 'shipments' && (
          <>
            {loadingShipments ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-bee-gold/20 border-t-bee-gold" />
              </div>
            ) : shipments ? (
              <ShipmentsList
                data={shipments}
                currentPage={shipmentsPage}
                limit={20}
                onPageChange={setShipmentsPage}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Erro ao carregar bonificações.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function AffiliateDashboardPage() {
  return (
    <AffiliateProtectedRoute>
      <AffiliateDashboardContent />
    </AffiliateProtectedRoute>
  );
}

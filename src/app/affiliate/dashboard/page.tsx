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
  const logoutMutation = useAffiliateLogout();
  const router = useRouter();
  const affiliatePath = useAffiliatePath();

  const dateFilter = getPeriodDates(period);

  const { data: commissionsData, isLoading: loadingCommissions } = useMyCommissions(1, 20, dateFilter);
  const { data: shipments, isLoading: loadingShipments } = useMyShipments(dateFilter);

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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bee-gold text-lg font-black text-black">
              🐝
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{user?.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Portal do Afiliado</p>
            </div>
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

      {/* Period filter */}
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="flex gap-1.5 flex-wrap">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-bee-gold text-black'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('commissions')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'commissions'
                ? 'border-bee-gold text-bee-gold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Comissões
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'shipments'
                ? 'border-bee-gold text-bee-gold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="h-4 w-4" />
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
              <CommissionsSummary data={commissionsData} />
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
              <ShipmentsList shipments={shipments} />
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

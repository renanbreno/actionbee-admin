'use client';

import { CommissionReport, CommissionOrder } from '@/contexts/commissions/domain/entities/commission';
import { TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

function formatBRL(value: number) {
  const parts = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).formatToParts(value);
  const currency = parts.find((p) => p.type === 'currency')?.value || 'R$';
  const rest = parts.filter((p) => p.type !== 'currency').map((p) => p.value).join('').trim();
  
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="text-[0.65em] font-normal text-muted-foreground">{currency}</span>
      <span>{rest}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  const label: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    CANCELLED: 'Cancelado',
  };
  const borderMap: Record<string, string> = {
    PENDING: 'border-yellow-200 bg-yellow-50/50',
    PAID: 'border-green-200 bg-green-50/50',
    CANCELLED: 'border-red-200 bg-red-50/50',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${map[status] ?? 'text-muted-foreground'} ${borderMap[status] ?? 'border-border bg-muted/20'}`}>
      {status === 'PAID' && <CheckCircle className="mr-1 h-3 w-3" />}
      {status === 'PENDING' && <Clock className="mr-1 h-3 w-3" />}
      {label[status] ?? status}
    </span>
  );
}

export function CommissionsSummary({ data }: { data: CommissionReport }) {
  const { summary, orders } = data;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="group rounded-2xl border bg-card p-4 space-y-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 bg-bee-gold w-16 h-16 rounded-bl-full rounded-tr-xl -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bee-gold/10 ring-1 ring-bee-gold/20">
              <TrendingUp className="h-4 w-4 text-bee-gold" />
            </div>
            <span className="text-xs font-medium">Total comissões</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{formatBRL(summary.totalCommissionAmount)}</p>
        </div>
        <div className="group rounded-2xl border bg-card p-4 space-y-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/20">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <span className="text-xs font-medium">A receber</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{formatBRL(summary.pendingCommissionAmount)}</p>
        </div>
        <div className="group rounded-2xl border bg-card p-4 space-y-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2.5 text-muted-foreground">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
             </div>
            <span className="text-xs font-medium">Recebido</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{formatBRL(summary.paidCommissionAmount)}</p>
        </div>
        <div className="group rounded-2xl border bg-card p-4 space-y-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 ring-1 ring-black/5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium">Pedidos</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{summary.totalOrders}</p>
        </div>
      </div>

      {/* Orders list — responsive */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">Pedidos com comissão</h3>
        </div>

        {orders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Pedido</th>
                    <th className="px-4 py-2 font-medium">Cliente</th>
                    <th className="px-4 py-2 font-medium">Valor</th>
                    <th className="px-4 py-2 font-medium">Comissão</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order: CommissionOrder) => (
                    <tr key={order.orderId} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.customerName}</td>
                      <td className="px-4 py-3">{formatBRL(order.discountedAmount)}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {order.commissionAmount != null ? formatBRL(order.commissionAmount) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right sm:text-left">
                        <StatusBadge status={order.commissionStatus ?? 'PENDING'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-3 p-3 bg-muted/20">
              {orders.map((order: CommissionOrder) => (
                <div key={order.orderId} className={`rounded-xl bg-card p-4 shadow-sm border space-y-3 relative overflow-hidden ${
                  order.commissionStatus === 'PAID' ? 'border-l-4 border-l-green-500' :
                  order.commissionStatus === 'PENDING' ? 'border-l-4 border-l-yellow-400' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">#{order.orderNumber}</span>
                      <p className="text-sm font-semibold">{order.customerName}</p>
                    </div>
                    <StatusBadge status={order.commissionStatus ?? 'PENDING'} />
                  </div>
                  <div className="pt-2 flex items-center justify-between text-sm border-t border-dashed">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase opacity-80">Valor do pedido</span>
                      <span className="font-medium text-muted-foreground">{formatBRL(order.discountedAmount)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground uppercase opacity-80">Comissão</span>
                      <span className="font-bold text-foreground">
                        {order.commissionAmount != null ? formatBRL(order.commissionAmount) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

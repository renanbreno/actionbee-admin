'use client';

import { CommissionReport, CommissionOrder } from '@/contexts/commissions/domain/entities/commission';
import { TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? 'bg-muted text-muted-foreground'}`}>
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
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-bee-gold" />
            <span className="text-xs font-medium">Total comissões</span>
          </div>
          <p className="text-lg font-bold">{formatBRL(summary.totalCommissionAmount)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-medium">A receber</span>
          </div>
          <p className="text-lg font-bold">{formatBRL(summary.pendingCommissionAmount)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium">Recebido</span>
          </div>
          <p className="text-lg font-bold">{formatBRL(summary.paidCommissionAmount)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Pedidos</span>
          </div>
          <p className="text-lg font-bold">{summary.totalOrders}</p>
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
                    <tr key={order.orderId} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.customerName}</td>
                      <td className="px-4 py-3">{formatBRL(order.discountedAmount)}</td>
                      <td className="px-4 py-3 font-medium text-bee-gold">
                        {order.commissionAmount != null ? formatBRL(order.commissionAmount) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.commissionStatus ?? 'PENDING'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y">
              {orders.map((order: CommissionOrder) => (
                <div key={order.orderId} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{order.orderNumber}</span>
                    <StatusBadge status={order.commissionStatus ?? 'PENDING'} />
                  </div>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatBRL(order.discountedAmount)}</span>
                    <span className="font-semibold text-bee-gold">
                      {order.commissionAmount != null ? formatBRL(order.commissionAmount) : '—'}
                    </span>
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

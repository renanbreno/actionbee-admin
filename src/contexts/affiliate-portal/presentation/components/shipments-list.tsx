'use client';

import { AffiliateShipment, ShipmentItem } from '@/contexts/affiliate-shipments/domain/entities/affiliate-shipment';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

function ShipmentStatusIcon({ status }: { status: string }) {
  if (status === 'DELIVERED') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === 'SHIPPED') return <Truck className="h-4 w-4 text-blue-500" />;
  return <Clock className="h-4 w-4 text-yellow-500" />;
}

function ShipmentStatusLabel({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'Pendente',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
  };
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    SHIPPED: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? 'bg-muted text-muted-foreground'}`}>
      {map[status] ?? status}
    </span>
  );
}

export function ShipmentsList({ shipments }: { shipments: AffiliateShipment[] }) {
  if (shipments.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-4 py-8 text-center">
        <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Nenhuma bonificação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {shipments.map((shipment) => (
        <div key={shipment.id} className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <ShipmentStatusIcon status={shipment.status} />
              <span className="text-sm font-medium">{shipment.referenceMonth}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShipmentStatusLabel status={shipment.status} />
            </div>
          </div>

          <div className="divide-y">
            {shipment.items.map((item: ShipmentItem) => (
              <div key={item.productId} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="text-muted-foreground">{item.productName}</span>
                <span className="text-xs text-muted-foreground">{item.quantity}×</span>
              </div>
            ))}
          </div>

          {shipment.notes && (
            <div className="border-t px-4 py-2 text-xs text-muted-foreground">
              {shipment.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

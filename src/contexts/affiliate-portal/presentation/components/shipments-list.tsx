'use client';

import { useState } from 'react';
import { ShipmentReport, AffiliateShipment, ShipmentItem } from '@/contexts/affiliate-shipments/domain/entities/affiliate-shipment';
import { Package, Truck, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

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
    PENDING: 'border-yellow-200 bg-yellow-50/50 text-yellow-800',
    SHIPPED: 'border-blue-200 bg-blue-50/50 text-blue-800',
    DELIVERED: 'border-green-200 bg-green-50/50 text-green-800',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${colors[status] ?? 'bg-muted/20 border-border text-muted-foreground'}`}>
      {map[status] ?? status}
    </span>
  );
}

export function ShipmentsList({ data, onPageChange, currentPage, limit }: {
  data: ShipmentReport;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  limit?: number;
}) {
  if (!data) {
    return (
      <div className="rounded-xl border bg-card px-4 py-8 text-center">
        <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Nenhuma bonificação encontrada.</p>
      </div>
    );
  }

  const { shipments, total, totalPages } = data;
  const [localPage, setLocalPage] = useState(currentPage || 1);

  const currentPageValue = currentPage ?? localPage;
  const handlePageChange = onPageChange ?? setLocalPage;
  const calculatedTotalPages = totalPages ?? Math.ceil(total / (limit || 20));

  if (total === 0) {
    return (
      <div className="rounded-xl border bg-card px-4 py-8 text-center">
        <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Nenhuma bonificação encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {shipments?.map((shipment) => (
          <div key={shipment.id} className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-black/5">
                  <ShipmentStatusIcon status={shipment.status} />
                </div>
                <div>
                  <span className="text-sm font-semibold">{shipment.referenceMonth}</span>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase tracking-wide">Ref: {shipment.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShipmentStatusLabel status={shipment.status} />
              </div>
            </div>

            <div className="divide-y px-2">
              {shipment.items?.map((item: ShipmentItem) => (
                <div key={item.productId} className="flex items-center justify-between px-2 py-3 text-sm group-hover:bg-muted/20 transition-colors rounded-lg my-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded bg-muted/50 text-xs font-medium text-muted-foreground">
                      {item.quantity}x
                    </div>
                    <span className="font-medium text-foreground">{item.productName}</span>
                  </div>
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

      {/* Pagination - mostrado fora da lista, apenas se tiver mais de uma página */}
      {calculatedTotalPages > 1 && (
        <Pagination
          currentPage={currentPageValue}
          totalPages={calculatedTotalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

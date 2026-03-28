"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGiftStockMovements } from "../hooks/use-gift-stock-movements";
import type { GiftStockMovType } from "../../domain/entities/gift-stock-movement";

const MOVEMENT_TYPE_LABELS: Record<GiftStockMovType, string> = {
  IN: "Entrada",
  OUT: "Saída",
  RETURN: "Devolução",
  ADJUSTMENT: "Ajuste",
};

const MOVEMENT_TYPE_COLORS: Record<GiftStockMovType, string> = {
  IN: "bg-green-100 text-green-800 border-green-200",
  OUT: "bg-red-100 text-red-800 border-red-200",
  RETURN: "bg-blue-100 text-blue-800 border-blue-200",
  ADJUSTMENT: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface GiftStockMovementsSheetProps {
  giftTierId: string | null;
  giftName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftStockMovementsSheet({
  giftTierId,
  giftName,
  open,
  onOpenChange,
}: GiftStockMovementsSheetProps) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [giftTierId]);
  const { data: movementsData, isLoading } = useGiftStockMovements(giftTierId, page);
  const pageSize = movementsData?.data.length ?? 20;
  const totalPages = movementsData ? Math.ceil(movementsData.total / pageSize) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Movimentações — {giftName}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          )}

          {!isLoading && (!movementsData || movementsData.data.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
              Nenhuma movimentação registrada
            </p>
          )}

          {!isLoading && movementsData && movementsData.data.length > 0 && (
            <>
              <div className="space-y-2">
                {movementsData.data.map((movement) => (
                  <div key={movement.id} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          MOVEMENT_TYPE_COLORS[movement.type]
                        }`}
                      >
                        {MOVEMENT_TYPE_LABELS[movement.type]}
                      </span>
                      <span className="font-semibold text-sm">
                        {movement.type === "IN" || movement.type === "RETURN" ? "+" : "-"}
                        {movement.quantity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(movement.createdAt)}
                    </p>
                    {movement.orderId && (
                      <p className="text-xs text-muted-foreground">
                        Pedido: <span className="font-mono">{movement.orderId.slice(-8)}</span>
                      </p>
                    )}
                    {movement.shipmentId && (
                      <p className="text-xs text-muted-foreground">
                        Bonificação: <span className="font-mono">{movement.shipmentId.slice(-8)}</span>
                      </p>
                    )}
                    {movement.reason && (
                      <p className="text-xs text-muted-foreground">{movement.reason}</p>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

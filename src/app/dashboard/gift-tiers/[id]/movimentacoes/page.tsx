"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Gift,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGiftTiers } from "@/contexts/gift-tiers/presentation/hooks/use-gift-tiers";
import { useGiftStockMovements } from "@/contexts/gift-inventory/presentation/hooks/use-gift-stock-movements";
import { AddGiftStockAdjustmentDialog } from "@/contexts/gift-inventory/presentation/components/add-gift-stock-adjustment-dialog";
import type { GiftStockMovType } from "@/contexts/gift-inventory/domain/entities/gift-stock-movement";
import { cn } from "@/lib/utils";

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

export default function GiftMovementsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const { data: giftTiers = [] } = useGiftTiers();
  const giftTier = giftTiers.find((g) => g.id === id) ?? null;

  const { data: movementsData, isLoading } = useGiftStockMovements(id, page);

  const LIMIT = 20;
  const totalPages = movementsData ? Math.ceil(movementsData.total / LIMIT) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => router.push("/dashboard/gift-tiers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bee-gold/10">
              <Gift className="h-5 w-5 text-bee-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                {giftTier?.name ?? "Brinde"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Histórico de movimentações de estoque
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setAdjustmentOpen(true)}
          disabled={!giftTier}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Ajustar estoque
        </Button>
      </div>

      {/* Info card */}
      {giftTier && (
        <div className="rounded-lg border bg-card p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {giftTier.imageUrl ? (
              <img
                src={giftTier.imageUrl}
                alt={giftTier.name}
                className="h-14 w-14 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Gift className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-semibold">{giftTier.name}</p>
              {giftTier.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {giftTier.description}
                </p>
              )}
              <Badge
                variant="outline"
                className={cn(
                  "mt-1.5 gap-1.5 text-xs font-medium",
                  giftTier.isActive
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                    : "border-zinc-400/30 bg-zinc-400/10 text-zinc-500",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    giftTier.isActive ? "bg-emerald-500" : "bg-zinc-400",
                  )}
                />
                {giftTier.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Estoque atual</p>
            <p
              className={cn(
                "text-3xl font-bold tabular-nums",
                giftTier.stockUnits > 0 ? "text-emerald-600" : "text-red-500",
              )}
            >
              {giftTier.stockUnits}
            </p>
            <p className="text-xs text-muted-foreground">unidades</p>
          </div>
        </div>
      )}

      {/* Movements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Movimentações</h2>
          {movementsData && (
            <p className="text-xs text-muted-foreground">
              {movementsData.total} registros no total
            </p>
          )}
        </div>

        {isLoading && (
          <div className="rounded-lg border divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-3 w-8 rounded bg-muted ml-auto" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!movementsData || movementsData.data.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border py-16 text-center">
            <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Nenhuma movimentação registrada
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              As movimentações aparecerão aqui conforme os pedidos forem processados
            </p>
          </div>
        )}

        {!isLoading && movementsData && movementsData.data.length > 0 && (
          <>
            {/* Mobile: cards */}
            <div className="sm:hidden space-y-2">
              {movementsData.data.map((movement) => (
                <div key={movement.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        MOVEMENT_TYPE_COLORS[movement.type]
                      }`}
                    >
                      {MOVEMENT_TYPE_LABELS[movement.type]}
                    </span>
                    <span
                      className={cn(
                        "font-bold text-sm tabular-nums",
                        movement.type === "IN" || movement.type === "RETURN"
                          ? "text-emerald-600"
                          : "text-red-500",
                      )}
                    >
                      {movement.type === "IN" || movement.type === "RETURN" ? "+" : "−"}
                      {movement.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(movement.createdAt)}
                  </p>
                  {movement.orderId && (
                    <p className="text-xs text-muted-foreground">
                      Pedido:{" "}
                      <span className="font-medium font-mono">
                        {movement.orderNumber ?? `#${movement.orderId.slice(-8)}`}
                      </span>
                    </p>
                  )}
                  {movement.shipmentId && (
                    <p className="text-xs text-muted-foreground">
                      Afiliado:{" "}
                      <span className="font-medium">
                        {movement.affiliateName ?? movement.shipmentId.slice(-8)}
                      </span>
                    </p>
                  )}
                  {movement.reason && !movement.shipmentId && (
                    <p className="text-xs text-muted-foreground">{movement.reason}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Data
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Tipo
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Quantidade
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Referência
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Motivo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {movementsData.data.map((movement) => (
                    <tr key={movement.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDateTime(movement.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            MOVEMENT_TYPE_COLORS[movement.type]
                          }`}
                        >
                          {MOVEMENT_TYPE_LABELS[movement.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            "font-bold tabular-nums",
                            movement.type === "IN" || movement.type === "RETURN"
                              ? "text-emerald-600"
                              : "text-red-500",
                          )}
                        >
                          {movement.type === "IN" || movement.type === "RETURN" ? "+" : "−"}
                          {movement.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {movement.orderId ? (
                          <span className="font-mono font-medium text-foreground">
                            {movement.orderNumber ?? `#${movement.orderId.slice(-8)}`}
                          </span>
                        ) : movement.shipmentId ? (
                          <span>
                            Afiliado:{" "}
                            <span className="font-medium text-foreground">
                              {movement.affiliateName ?? movement.shipmentId.slice(-8)}
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {movement.reason ?? (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="text-sm text-muted-foreground">
                  Página {page} de {totalPages} &middot; {movementsData.total} registros
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {giftTier && (
        <AddGiftStockAdjustmentDialog
          giftTierId={giftTier.id}
          giftName={giftTier.name}
          open={adjustmentOpen}
          onOpenChange={setAdjustmentOpen}
        />
      )}
    </div>
  );
}

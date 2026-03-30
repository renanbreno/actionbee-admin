"use client";

import { useState } from "react";
import { Boxes, Plus, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { productsApiClient } from "@/contexts/products/infrastructure/api/products-api.client";
import { useProductBatches } from "@/contexts/inventory/presentation/hooks/use-product-batches";
import { useStockMovements } from "@/contexts/inventory/presentation/hooks/use-stock-movements";
import { AddStockEntryDialog } from "@/contexts/inventory/presentation/components/add-stock-entry-dialog";
import { AddStockAdjustmentDialog } from "@/contexts/inventory/presentation/components/add-stock-adjustment-dialog";
import type { Product } from "@/contexts/products/domain/entities/product";
import type { StockMovementType } from "@/contexts/inventory/domain/entities/stock-movement";

const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  IN: "Entrada",
  OUT: "Saída",
  RETURN: "Devolução",
  ADJUSTMENT: "Ajuste",
};

const MOVEMENT_TYPE_COLORS: Record<StockMovementType, string> = {
  IN: "bg-green-100 text-green-800 border-green-200",
  OUT: "bg-red-100 text-red-800 border-red-200",
  RETURN: "bg-blue-100 text-blue-800 border-blue-200",
  ADJUSTMENT: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function movementSign(type: StockMovementType, quantity: number): "+" | "−" {
  if (type === "ADJUSTMENT") return quantity >= 0 ? "+" : "−";
  return type === "IN" || type === "RETURN" ? "+" : "−";
}

function movementIsPositive(type: StockMovementType, quantity: number): boolean {
  if (type === "ADJUSTMENT") return quantity >= 0;
  return type === "IN" || type === "RETURN";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [movementsPage, setMovementsPage] = useState(1);
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: productsData, isFetching: searchingProducts } = useQuery({
    queryKey: ["products-search", debouncedSearch],
    queryFn: () => productsApiClient.getAllPaginated(1, 10, debouncedSearch || undefined),
    enabled: showProductSearch && debouncedSearch.length > 0,
  });

  const { data: freshProduct } = useQuery({
    queryKey: ["product", selectedProduct?.id],
    queryFn: () => productsApiClient.getById(selectedProduct!.id),
    enabled: !!selectedProduct,
  });

  const currentStockUnits = freshProduct?.stockUnits ?? selectedProduct?.stockUnits ?? 0;

  const { data: batches, isLoading: loadingBatches, refetch: refetchBatches } = useProductBatches(
    selectedProduct?.id ?? null,
    includeInactive,
  );

  const { data: movementsData, isLoading: loadingMovements } = useStockMovements(
    selectedProduct?.id ?? null,
    movementsPage,
  );

  const totalMovementPages = movementsData
    ? Math.ceil(movementsData.total / 20)
    : 0;

  function selectProduct(product: Product) {
    setSelectedProduct(product);
    setShowProductSearch(false);
    setSearchTerm("");
    setMovementsPage(1);
    setIncludeInactive(false);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bee-gold/10">
            <Boxes className="h-5 w-5 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Controle de Estoque</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Gerencie lotes e movimentações</p>
          </div>
        </div>
        {selectedProduct && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setAdjustmentOpen(true)} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Ajuste de Estoque
            </Button>
            <Button onClick={() => setAddEntryOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Lote
            </Button>
          </div>
        )}
      </div>

      {/* Product Search */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto por nome..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowProductSearch(true);
            }}
            onFocus={() => setShowProductSearch(true)}
            className="pl-9"
          />
        </div>

        {showProductSearch && debouncedSearch.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchingProducts && (
              <div className="p-3 text-sm text-muted-foreground">Buscando...</div>
            )}
            {!searchingProducts && productsData?.data.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground">Nenhum produto encontrado</div>
            )}
            {!searchingProducts &&
              productsData?.data.map((product) => (
                <button
                  key={product.id}
                  className="w-full text-left px-4 py-2 hover:bg-muted text-sm flex items-center justify-between"
                  onClick={() => selectProduct(product)}
                >
                  <span>{product.name}</span>
                  <span className="text-muted-foreground text-xs">{product.stockUnits ?? 0} un.</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {!selectedProduct && (
        <div className="text-center py-16 text-muted-foreground">
          <Boxes className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Busque e selecione um produto para gerenciar o estoque</p>
        </div>
      )}

      {selectedProduct && (
        <>
          {/* Product Info */}
          <div className="rounded-lg border p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Produto selecionado</p>
              <p className="font-semibold text-base sm:text-lg">{selectedProduct.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Estoque atual</p>
              <p className="text-xl sm:text-2xl font-bold">
                {currentStockUnits}
                <span className="text-sm font-normal text-muted-foreground ml-1">unidades</span>
              </p>
            </div>
          </div>

          {/* Batches */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-semibold">
                Lotes {includeInactive ? "" : "Ativos"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchBatches()}
                  disabled={loadingBatches}
                >
                  <RefreshCw className={`h-4 w-4 ${loadingBatches ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIncludeInactive((v) => !v)}
                >
                  {includeInactive ? "Ocultar inativos" : "Mostrar todos"}
                </Button>
              </div>
            </div>

            {loadingBatches && (
              <div className="text-sm text-muted-foreground py-4 text-center">Carregando lotes...</div>
            )}

            {!loadingBatches && (!batches || batches.length === 0) && (
              <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                Nenhum lote {includeInactive ? "" : "ativo"} encontrado para este produto
              </div>
            )}

            {!loadingBatches && batches && batches.length > 0 && (
              <>
                {/* Mobile: cards */}
                <div className="sm:hidden space-y-2">
                  {batches.map((batch) => (
                    <div
                      key={batch.id}
                      className={`rounded-lg border p-3 space-y-2 ${batch.isActive ? "" : "opacity-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-medium">{batch.batchNumber}</span>
                        <Badge variant={batch.isActive ? "default" : "secondary"}>
                          {batch.isActive ? "Ativo" : "Esgotado"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Validade</p>
                          <p className={new Date(batch.expiryDate) < new Date() ? "text-red-600 font-medium" : ""}>
                            {formatDate(batch.expiryDate)}
                          </p>
                        </div>
                        {batch.manufacturingDate && (
                          <div>
                            <p className="text-xs text-muted-foreground">Fabricação</p>
                            <p>{formatDate(batch.manufacturingDate)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Qtd. inicial</p>
                          <p>{batch.initialQuantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Qtd. atual</p>
                          <p className="font-semibold">{batch.currentQuantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: table */}
                <div className="hidden sm:block rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Lote</th>
                        <th className="text-left px-4 py-3 font-medium">Fabricação</th>
                        <th className="text-left px-4 py-3 font-medium">Validade</th>
                        <th className="text-right px-4 py-3 font-medium">Inicial</th>
                        <th className="text-right px-4 py-3 font-medium">Atual</th>
                        <th className="text-center px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {batches.map((batch) => (
                        <tr key={batch.id} className={batch.isActive ? "" : "opacity-50"}>
                          <td className="px-4 py-3 font-mono text-xs">{batch.batchNumber}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {batch.manufacturingDate ? formatDate(batch.manufacturingDate) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={
                                new Date(batch.expiryDate) < new Date()
                                  ? "text-red-600 font-medium"
                                  : ""
                              }
                            >
                              {formatDate(batch.expiryDate)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">{batch.initialQuantity}</td>
                          <td className="px-4 py-3 text-right font-semibold">{batch.currentQuantity}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant={batch.isActive ? "default" : "secondary"}>
                              {batch.isActive ? "Ativo" : "Esgotado"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Movements */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Movimentações</h2>

            {loadingMovements && (
              <div className="text-sm text-muted-foreground py-4 text-center">Carregando movimentações...</div>
            )}

            {!loadingMovements && (!movementsData || movementsData.data.length === 0) && (
              <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                Nenhuma movimentação registrada
              </div>
            )}

            {!loadingMovements && movementsData && movementsData.data.length > 0 && (
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
                        <span className={`font-semibold text-sm ${movementIsPositive(movement.type, movement.quantity) ? "text-emerald-600" : "text-red-500"}`}>
                          {movementSign(movement.type, movement.quantity)}
                          {Math.abs(movement.quantity)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Data</p>
                          <p className="text-xs">{formatDateTime(movement.createdAt)}</p>
                        </div>
                        {movement.orderId && (
                          <div>
                            <p className="text-xs text-muted-foreground">Pedido</p>
                            <p className="font-mono text-xs">
                              {movement.orderNumber ?? movement.orderId.slice(-8)}
                            </p>
                          </div>
                        )}
                        {movement.batchNumber && (
                          <div>
                            <p className="text-xs text-muted-foreground">Lote</p>
                            <p className="font-mono text-xs">{movement.batchNumber}</p>
                          </div>
                        )}
                        {movement.reason && (
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Motivo</p>
                            <p className="text-xs">{movement.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: table */}
                <div className="hidden sm:block rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Data</th>
                        <th className="text-left px-4 py-3 font-medium">Tipo</th>
                        <th className="text-right px-4 py-3 font-medium">Qtd</th>
                        <th className="text-left px-4 py-3 font-medium">Lote</th>
                        <th className="text-left px-4 py-3 font-medium">Pedido</th>
                        <th className="text-left px-4 py-3 font-medium">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {movementsData.data.map((movement) => (
                        <tr key={movement.id}>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
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
                          <td className={`px-4 py-3 text-right font-semibold ${movementIsPositive(movement.type, movement.quantity) ? "text-emerald-600" : "text-red-500"}`}>
                            {movementSign(movement.type, movement.quantity)}
                            {Math.abs(movement.quantity)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                            {movement.batchNumber ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                            {movement.orderNumber ?? (movement.orderId ? movement.orderId.slice(-8) : "—")}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {movement.reason ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalMovementPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Página {movementsPage} de {totalMovementPages} ({movementsData.total} registros)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMovementsPage((p) => Math.max(1, p - 1))}
                        disabled={movementsPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMovementsPage((p) => Math.min(totalMovementPages, p + 1))}
                        disabled={movementsPage === totalMovementPages}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {selectedProduct && (
        <>
          <AddStockEntryDialog
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            open={addEntryOpen}
            onOpenChange={setAddEntryOpen}
          />
          <AddStockAdjustmentDialog
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            open={adjustmentOpen}
            onOpenChange={setAdjustmentOpen}
          />
        </>
      )}
    </div>
  );
}

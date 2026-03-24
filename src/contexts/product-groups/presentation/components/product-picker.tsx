"use client";

import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/contexts/products/presentation/hooks/use-products";

interface ProductPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/**
 * Seletor multi-produto com busca.
 * Mostra uma lista pesquisável de produtos; o usuário marca/desmarca.
 */
export function ProductPicker({ selectedIds, onChange }: ProductPickerProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useProducts(1, 50, search || undefined);

  const products = data?.data ?? [];

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  // Also include products that are selected but not in current search results
  // (they might have been found in a previous search)

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Selected badges */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const product = products.find((p) => p.id === id);
            const name = product?.name ?? id.slice(0, 8) + "…";
            return (
              <Badge key={id} variant="secondary" className="gap-1 pr-1">
                <span className="max-w-[160px] truncate text-xs">{name}</span>
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Product list */}
      <ScrollArea className="h-52 rounded-md border">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado
          </div>
        ) : (
          <div className="p-1">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggle(product.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span className="flex-1 truncate font-medium">{product.name}</span>
                  {product.categoryName && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {product.categoryName}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        {selectedIds.length} produto{selectedIds.length !== 1 ? "s" : ""} selecionado{selectedIds.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

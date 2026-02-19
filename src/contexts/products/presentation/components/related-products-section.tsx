"use client";

import { useState, useEffect } from "react";
import { Search, X, Plus, GripVertical, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProducts } from "../hooks/use-products";
import { RelatedProduct } from "../../domain/entities/product";

interface RelatedProductsSectionProps {
  productId: string;
  relatedProducts: RelatedProduct[];
  onChange: (related: RelatedProduct[]) => void;
}

export function RelatedProductsSection({
  productId,
  relatedProducts,
  onChange,
}: RelatedProductsSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: searchResults } = useProducts(1, 8, debouncedSearch);

  const handleAdd = (related: { productId: string; name: string }) => {
    if (relatedProducts.some((r) => r.productId === related.productId)) return;
    if (related.productId === productId) return;
    onChange([
      ...relatedProducts,
      { productId: related.productId, name: related.name, order: relatedProducts.length + 1 },
    ]);
  };

  const handleRemove = (relatedProductId: string) => {
    onChange(
      relatedProducts
        .filter((r) => r.productId !== relatedProductId)
        .map((r, i) => ({ ...r, order: i + 1 })),
    );
  };

  const searchedProducts = (searchResults?.data ?? []).filter(
    (p) =>
      p.id !== productId &&
      !relatedProducts.some((r) => r.productId === p.id),
  );

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Produtos Relacionados
      </h2>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm">Buscar produto para adicionar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nome do produto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Search results */}
        {debouncedSearch && searchedProducts.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm divide-y">
            {searchedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">{p.name}</span>
                <button
                  type="button"
                  onClick={() => handleAdd({ productId: p.id, name: p.name })}
                  className="flex items-center gap-1 text-xs text-bee-gold hover:text-bee-amber font-medium transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        )}
        {debouncedSearch && searchedProducts.length === 0 && (
          <p className="text-xs text-muted-foreground px-1">
            Nenhum produto encontrado.
          </p>
        )}
      </div>

      {/* Related list */}
      {relatedProducts.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-sm">
            Relacionados ({relatedProducts.length})
          </Label>
          <div className="rounded-lg border bg-card divide-y">
            {relatedProducts.map((related, i) => (
              <div
                key={related.productId}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground w-5 tabular-nums">
                  {i + 1}
                </span>
                <span className="text-sm flex-1 truncate">{related.name}</span>
                {related.isAutomatic && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/30">
                    <Sparkles className="h-2.5 w-2.5" />
                    Auto
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(related.productId)}
                  className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remover"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum produto relacionado.
        </p>
      )}
    </div>
  );
}

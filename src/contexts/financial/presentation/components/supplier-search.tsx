"use client";

import { useState } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Building2, Plus } from "lucide-react";
import type { Supplier } from "../../domain/entities/supplier";
import { formatCNPJ } from "@/shared/utils/masks";
import { QuickCreateSupplierDialog } from "./quick-create-supplier-dialog";

interface SupplierSearchProps {
  onSelect: (supplier: Supplier) => void;
  selected: Supplier | null;
  onClear: () => void;
}

export function SupplierSearch({ onSelect, selected, onClear }: SupplierSearchProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["financial-suppliers", { search: debouncedSearch, active: true }],
    queryFn: () =>
      apiFetch<Supplier[]>(
        `/admin/suppliers?search=${encodeURIComponent(debouncedSearch)}&active=true`,
      ),
    enabled: debouncedSearch.length >= 2,
  });

  const handleQuickCreateSuccess = (supplier: Supplier) => {
    queryClient.invalidateQueries({ queryKey: ["financial-suppliers"] });
    onSelect(supplier);
    setSearch("");
    setOpen(false);
    setQuickCreateOpen(false);
  };

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{selected.razaoSocial}</p>
            {selected.cnpj && (
              <p className="text-xs text-muted-foreground">{formatCNPJ(selected.cnpj)}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar fornecedor por nome..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            className="pl-9"
          />
        </div>
        {open && debouncedSearch.length >= 2 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
            {isLoading && (
              <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <div className="p-3">
                <p className="text-sm text-muted-foreground mb-2">Nenhum fornecedor encontrado.</p>
                <button
                  className="w-full text-left text-sm text-bee-gold hover:underline flex items-center gap-1.5"
                  onMouseDown={() => {
                    setQuickCreateOpen(true);
                    setOpen(false);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Cadastrar novo fornecedor
                </button>
              </div>
            )}
            {data?.map((s) => (
              <button
                key={s.id}
                className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                onMouseDown={() => {
                  onSelect(s);
                  setSearch("");
                  setOpen(false);
                }}
              >
                <p className="font-medium">{s.razaoSocial}</p>
                {s.cnpj && <p className="text-xs text-muted-foreground">{formatCNPJ(s.cnpj)}</p>}
              </button>
            ))}
            {data && data.length > 0 && (
              <div className="border-t px-3 py-2">
                <button
                  className="w-full text-left text-sm text-bee-gold hover:underline flex items-center gap-1.5"
                  onMouseDown={() => {
                    setQuickCreateOpen(true);
                    setOpen(false);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Cadastrar novo fornecedor
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <QuickCreateSupplierDialog
        open={quickCreateOpen}
        onOpenChange={setQuickCreateOpen}
        onSuccess={handleQuickCreateSuccess}
      />
    </>
  );
}

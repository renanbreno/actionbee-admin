"use client";

import { useState, useEffect } from "react";
import { Filter, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useAbandonedCarts } from "../hooks/use-abandoned-carts";
import { AbandonedCartsFilters } from "../components/abandoned-carts-filters";
import { AbandonedCartsTable } from "../components/abandoned-carts-table";

type CheckoutStepFilter = "all" | "CART" | "CHECKOUT" | "PAYMENT";

export function AbandonedCartsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    checkoutStep: "all" as CheckoutStepFilter,
    startDate: "",
    endDate: "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const { data, isLoading, isError, refetch, isFetching } = useAbandonedCarts({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    checkoutStep: filters.checkoutStep === "all" ? undefined : filters.checkoutStep,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.checkoutStep, filters.startDate, filters.endDate]);

  const total = data?.total ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Carrinhos Abandonados</h1>
              {total > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Contate clientes e recupere vendas perdidas
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setFilters({ search: "", checkoutStep: "all", startDate: "", endDate: "" });
              setPage(1);
            }}
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AbandonedCartsFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <AbandonedCartsTable
        carts={data?.abandonedCarts ?? []}
        totalPages={data?.totalPages ?? 1}
        page={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

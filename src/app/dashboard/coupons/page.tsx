"use client";

import { useState } from "react";
import { Ticket, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CouponsTable } from "@/contexts/coupons/presentation/components/coupons-table";
import { CreateCouponDialog } from "@/contexts/coupons/presentation/components/create-coupon-dialog";
import { useCoupons } from "@/contexts/coupons/presentation/hooks/use-coupons";
import { useDebounce } from "@/shared/hooks/use-debounce";

const STATUS_FILTERS = [
  {
    value: undefined,
    label: "Todos",
    dot: "bg-bee-gold",
    activeClass: "border-bee-gold/30 bg-bee-gold/10 text-amber-800",
  },
  {
    value: "ACTIVE",
    label: "Ativos",
    dot: "bg-emerald-500",
    ping: true,
    activeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    value: "INACTIVE",
    label: "Inativos",
    dot: "bg-muted-foreground/40",
    activeClass: "border-zinc-300 bg-zinc-100 text-zinc-700",
  },
  {
    value: "EXPIRED",
    label: "Expirados",
    dot: "bg-red-400",
    activeClass: "border-red-200 bg-red-50 text-red-700",
  },
] as const;

export default function CouponsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 400);

  const { data } = useCoupons(page, 10, debouncedSearch || undefined, statusFilter);
  const total = data?.total ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Cupons</h1>
              {total > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total} {total === 1 ? "cadastrado" : "cadastrados"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie os cupons de desconto da loja.
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      {/* Search + Status Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por código ou afiliado..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex justify-center sm:justify-start gap-1.5 overflow-x-auto pb-0.5">
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <button
                key={filter.label}
                onClick={() => handleStatusChange(filter.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                  isActive
                    ? filter.activeClass
                    : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="relative flex h-2 w-2">
                  {isActive && "ping" in filter && filter.ping && (
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                        filter.dot,
                      )}
                    />
                  )}
                  <span className={cn("relative inline-flex h-2 w-2 rounded-full", filter.dot)} />
                </span>
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <CouponsTable
        page={page}
        onPageChange={setPage}
        search={debouncedSearch || undefined}
        status={statusFilter}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Novo Cupom"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <CreateCouponDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

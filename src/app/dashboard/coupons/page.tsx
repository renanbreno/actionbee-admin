"use client";

import { useState } from "react";
import { Ticket, Plus, Search, BarChart3, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CouponsTable } from "@/contexts/coupons/presentation/components/coupons-table";
import { CreateCouponDialog } from "@/contexts/coupons/presentation/components/create-coupon-dialog";
import { useCoupons } from "@/contexts/coupons/presentation/hooks/use-coupons";
import { useAffiliateCategories } from "@/contexts/affiliate-categories/presentation/hooks/use-affiliate-categories";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useCommissions } from "@/contexts/commissions/presentation/hooks/use-commissions";
import { useMarkCommissionPaid } from "@/contexts/commissions/presentation/hooks/use-mark-commission-paid";
import { useCancelCommission } from "@/contexts/commissions/presentation/hooks/use-cancel-commission";
import { CommissionsTable } from "@/contexts/commissions/presentation/components/commissions-table";
import { CommissionFilters } from "@/contexts/commissions/presentation/components/commission-filters";
import { CommissionSummaryCards } from "@/contexts/commissions/presentation/components/commission-summary-cards";
import { ConfirmationDialog } from "@/contexts/commissions/presentation/components/confirmation-dialog";
import type { CommissionOrder } from "@/contexts/commissions/domain/entities/commission";

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

type CommissionStatusFilter = "all" | "PENDING" | "PAID" | "CANCELLED";

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState("coupons");

  // ── Coupon list state ──
  const [createOpen, setCreateOpen] = useState(false);
  const [couponPage, setCouponPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 400);

  const { data: couponsData } = useCoupons(couponPage, 10, debouncedSearch || undefined, statusFilter, categoryFilter);
  const { data: affiliateCategories } = useAffiliateCategories();
  const total = couponsData?.total ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCouponPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatusFilter(value);
    setCouponPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === "all" ? undefined : value);
    setCouponPage(1);
  };

  // ── Usage report (commissions) state ──
  const [reportPage, setReportPage] = useState(1);
  const [reportFilters, setReportFilters] = useState({
    couponCode: "",
    status: "all" as CommissionStatusFilter,
    startDate: "",
    endDate: "",
    affiliateCategoryId: "",
  });
  const debouncedCouponCode = useDebounce(reportFilters.couponCode, 500);

  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    type: "mark-paid" | "cancel";
    order: CommissionOrder | null;
  }>({ open: false, type: "mark-paid", order: null });

  const { data: commissionsData, isLoading: isCommissionsLoading, isError: isCommissionsError } = useCommissions({
    couponCode: debouncedCouponCode || undefined,
    status: reportFilters.status === "all" ? undefined : reportFilters.status,
    startDate: reportFilters.startDate || undefined,
    endDate: reportFilters.endDate || undefined,
    affiliateCategoryId: reportFilters.affiliateCategoryId || undefined,
    page: reportPage,
    limit: 10,
  });

  const markPaidMutation = useMarkCommissionPaid();
  const cancelMutation = useCancelCommission();

  const handleFiltersChange = (filters: typeof reportFilters) => {
    setReportFilters(filters);
    setReportPage(1);
  };

  const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return "—";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const handleMarkPaid = (order: CommissionOrder) => {
    setConfirmationDialog({ open: true, type: "mark-paid", order });
  };

  const handleCancel = (order: CommissionOrder) => {
    setConfirmationDialog({ open: true, type: "cancel", order });
  };

  const handleConfirmMarkPaid = () => {
    if (confirmationDialog.order) {
      markPaidMutation.mutate(confirmationDialog.order.orderId, {
        onSuccess: () => setConfirmationDialog((s) => ({ ...s, open: false })),
      });
    }
  };

  const handleConfirmCancel = () => {
    if (confirmationDialog.order) {
      cancelMutation.mutate(confirmationDialog.order.orderId, {
        onSuccess: () => setConfirmationDialog((s) => ({ ...s, open: false })),
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Cupons</h1>
              {activeTab === "coupons" && total > 0 && (
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

        {activeTab === "coupons" && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novo Cupom
          </Button>
        )}

        {activeTab === "usage-report" && (
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex gap-2"
            onClick={() => {
              setReportFilters({ couponCode: "", status: "all", startDate: "", endDate: "", affiliateCategoryId: "" });
              setReportPage(1);
            }}
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 h-auto sm:w-auto sm:grid-cols-none sm:inline-flex p-1">
          <TabsTrigger value="coupons" className="gap-1.5 h-10 sm:h-9 text-sm">
            <Ticket className="h-4 w-4 shrink-0" />
            <span>Cupons</span>
          </TabsTrigger>
          <TabsTrigger value="usage-report" className="gap-1.5 h-10 sm:h-9 text-sm">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>Relatório de Uso</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Lista de Cupons ── */}
        <TabsContent value="coupons" className="space-y-6">
          <div className="flex flex-col gap-3">
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Tipo de afiliado:</span>
              <Select value={categoryFilter ?? "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-8 w-52 text-xs">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {(affiliateCategories ?? []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CouponsTable
            page={couponPage}
            onPageChange={setCouponPage}
            search={debouncedSearch || undefined}
            status={statusFilter}
            affiliateCategoryId={categoryFilter}
          />
        </TabsContent>

        {/* ── Relatório de Uso ── */}
        <TabsContent value="usage-report" className="space-y-6">
          <CommissionSummaryCards summary={commissionsData?.summary} isLoading={isCommissionsLoading} />

          <CommissionFilters filters={reportFilters} onFiltersChange={handleFiltersChange} />

          <CommissionsTable
            orders={commissionsData?.orders ?? []}
            totalPages={commissionsData?.totalPages ?? 1}
            page={reportPage}
            onPageChange={setReportPage}
            isLoading={isCommissionsLoading}
            isError={isCommissionsError}
            onMarkPaid={handleMarkPaid}
            onCancel={handleCancel}
            isMarkPending={markPaidMutation.isPending}
            isCancelPending={cancelMutation.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Mobile FAB — só na aba de cupons */}
      {activeTab === "coupons" && (
        <button
          onClick={() => setCreateOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
          aria-label="Novo Cupom"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      )}

      <CreateCouponDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={(open) => setConfirmationDialog((s) => ({ ...s, open }))}
        type={confirmationDialog.type}
        orderNumber={confirmationDialog.order?.orderNumber ?? ""}
        customerName={confirmationDialog.order?.customerName ?? ""}
        commissionAmount={formatCurrency(confirmationDialog.order?.commissionAmount ?? null)}
        onConfirm={confirmationDialog.type === "mark-paid" ? handleConfirmMarkPaid : handleConfirmCancel}
        isPending={confirmationDialog.type === "mark-paid" ? markPaidMutation.isPending : cancelMutation.isPending}
      />
    </div>
  );
}

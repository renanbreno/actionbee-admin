"use client";

import { useState, useEffect } from "react";
import { DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommissions } from "@/contexts/commissions/presentation/hooks/use-commissions";
import { useMarkCommissionPaid } from "@/contexts/commissions/presentation/hooks/use-mark-commission-paid";
import { useCancelCommission } from "@/contexts/commissions/presentation/hooks/use-cancel-commission";
import { CommissionsTable } from "@/contexts/commissions/presentation/components/commissions-table";
import { CommissionFilters } from "@/contexts/commissions/presentation/components/commission-filters";
import { CommissionSummaryCards } from "@/contexts/commissions/presentation/components/commission-summary-cards";
import { ConfirmationDialog } from "@/contexts/commissions/presentation/components/confirmation-dialog";
import { useDebounce } from "@/shared/hooks/use-debounce";
import type { CommissionOrder } from "@/contexts/commissions/domain/entities/commission";

type StatusFilter = "all" | "PENDING" | "PAID" | "CANCELLED";

export default function CommissionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    couponCode: "",
    status: "all" as StatusFilter,
    startDate: "",
    endDate: "",
    affiliateCategoryId: "",
  });

  // Debounce the coupon code search to avoid excessive API calls
  const debouncedCouponCode = useDebounce(filters.couponCode, 500);

  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    type: "mark-paid" | "cancel";
    order: CommissionOrder | null;
  }>({
    open: false,
    type: "mark-paid",
    order: null,
  });

  const { data, isLoading, isError } = useCommissions({
    couponCode: debouncedCouponCode || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    affiliateCategoryId: filters.affiliateCategoryId || undefined,
    page,
    limit: 10,
  });

  const markPaidMutation = useMarkCommissionPaid();
  const cancelMutation = useCancelCommission();

  const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return "—";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const handleMarkPaid = (order: CommissionOrder) => {
    setConfirmationDialog({
      open: true,
      type: "mark-paid",
      order,
    });
  };

  const handleCancel = (order: CommissionOrder) => {
    setConfirmationDialog({
      open: true,
      type: "cancel",
      order,
    });
  };

  const handleConfirmMarkPaid = () => {
    if (confirmationDialog.order) {
      markPaidMutation.mutate(confirmationDialog.order.orderId, {
        onSuccess: () => {
          setConfirmationDialog({ ...confirmationDialog, open: false });
        },
      });
    }
  };

  const handleConfirmCancel = () => {
    if (confirmationDialog.order) {
      cancelMutation.mutate(confirmationDialog.order.orderId, {
        onSuccess: () => {
          setConfirmationDialog({ ...confirmationDialog, open: false });
        },
      });
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedCouponCode, filters.status, filters.startDate, filters.endDate, filters.affiliateCategoryId]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Comissões
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Acompanhe e gerencie pagamentos de comissões.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setFilters({
              couponCode: "",
              status: "all",
              startDate: "",
              endDate: "",
              affiliateCategoryId: "",
            });
            setPage(1);
          }}
        >
          <Filter className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>

      {/* Summary Cards */}
      <CommissionSummaryCards
        summary={data?.summary}
        isLoading={isLoading}
      />

      {/* Filters */}
      <CommissionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Table */}
      <CommissionsTable
        orders={data?.orders ?? []}
        totalPages={data?.totalPages ?? 1}
        page={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onMarkPaid={handleMarkPaid}
        onCancel={handleCancel}
        isMarkPending={markPaidMutation.isPending}
        isCancelPending={cancelMutation.isPending}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={(open) => setConfirmationDialog({ ...confirmationDialog, open })}
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

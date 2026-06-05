"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Package, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/contexts/orders/presentation/hooks/use-orders";
import { useUpdateOrderStatus } from "@/contexts/orders/presentation/hooks/use-update-order-status";
import { OrderFilters } from "@/contexts/orders/presentation/components/order-filters";
import { OrdersTable } from "@/contexts/orders/presentation/components/orders-table";
import { OrderDetailSheet } from "@/contexts/orders/presentation/components/order-detail-sheet";
import { UpdateOrderStatusDialog } from "@/contexts/orders/presentation/components/update-order-status-dialog";
import { UpdateOrderPaymentStatusDialog } from "@/contexts/orders/presentation/components/update-order-payment-status-dialog";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { ProtectedRoute } from "@/contexts/auth/presentation/components/protected-route";
import { useAuthContext } from "@/contexts/auth/presentation/providers/auth-provider";
import type { OrderListItem } from "@/contexts/orders/domain/entities/order";

type StatusFilter = "all" | "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredPermissions={["orders:view"]}>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission } = useAuthContext();
  const canCreate = hasPermission("orders:create");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    customerName: "",
    status: "all" as StatusFilter,
    startDate: "",
    endDate: "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedCustomerName = useDebounce(filters.customerName, 500);

  const [detailSheet, setDetailSheet] = useState<{
    open: boolean;
    orderId: string | null;
  }>({ open: false, orderId: null });

  // Open detail sheet when orderId is in URL params
  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      setDetailSheet({ open: true, orderId });
      // Clear the URL param to avoid re-opening on refresh
      router.replace("/dashboard/orders", { scroll: false });
    }
  }, [searchParams, router]);

  const [updateStatusDialog, setUpdateStatusDialog] = useState<{
    open: boolean;
    order: OrderListItem | null;
  }>({ open: false, order: null });

  const [updatePaymentStatusDialog, setUpdatePaymentStatusDialog] = useState<{
    open: boolean;
    order: OrderListItem | null;
  }>({ open: false, order: null });

  const { data, isLoading, isError, refetch, isFetching } = useOrders({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    customerName: debouncedCustomerName || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCustomerName, filters.status, filters.startDate, filters.endDate]);

  function handleViewDetail(order: OrderListItem) {
    setDetailSheet({ open: true, orderId: order.id });
  }

  function handleUpdateStatus(order: OrderListItem) {
    setUpdateStatusDialog({ open: true, order });
  }

  function handleCancel(order: OrderListItem) {
    setUpdateStatusDialog({
      open: true,
      order: { ...order },
    });
  }

  function handleUpdatePaymentStatus(order: OrderListItem) {
    setUpdatePaymentStatusDialog({ open: true, order });
  }

  const total = data?.total ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Pedidos</h1>
              {total > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie e acompanhe todos os pedidos
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
              setFilters({ search: "", customerName: "", status: "all", startDate: "", endDate: "" });
              setPage(1);
            }}
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
          {canCreate && (
            <Button
              onClick={() => router.push("/dashboard/orders/new")}
              className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <OrderFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <OrdersTable
        orders={data?.orders ?? []}
        totalPages={data?.totalPages ?? 1}
        page={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onCancel={handleCancel}
      />

      {/* Order Detail Sheet */}
      <OrderDetailSheet
        orderId={detailSheet.orderId}
        open={detailSheet.open}
        onOpenChange={(open) => setDetailSheet((s) => ({ ...s, open }))}
      />

      {/* Update Status Dialog */}
      <UpdateOrderStatusDialog
        order={updateStatusDialog.order}
        open={updateStatusDialog.open}
        onOpenChange={(open) =>
          setUpdateStatusDialog((s) => ({ ...s, open, order: open ? s.order : null }))
        }
      />

      {/* Update Payment Status Dialog */}
      <UpdateOrderPaymentStatusDialog
        order={updatePaymentStatusDialog.order}
        open={updatePaymentStatusDialog.open}
        onOpenChange={(open) =>
          setUpdatePaymentStatusDialog((s) => ({ ...s, open, order: open ? s.order : null }))
        }
      />

      {/* Mobile FAB */}
      {canCreate && (
        <button
          onClick={() => router.push("/dashboard/orders/new")}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
          aria-label="Novo Pedido"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Plus, UserCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendedoresTable } from "@/contexts/vendedores/presentation/components/vendedores-table";
import { VendedorFormDialog } from "@/contexts/vendedores/presentation/components/vendedor-form-dialog";
import { VendedorSalesReportFilters } from "@/contexts/vendedores/presentation/components/sales-report-filters";
import { VendedorSalesReportSummary } from "@/contexts/vendedores/presentation/components/sales-report-summary";
import { VendedorSalesReportTable } from "@/contexts/vendedores/presentation/components/sales-report-table";
import { useVendedorSalesReport } from "@/contexts/vendedores/presentation/hooks/use-sales-report";
import { useVendedorCommissionSummary } from "@/contexts/vendedores/presentation/hooks/use-commission-summary";
import { VendedorCommissionSummaryCard } from "@/contexts/vendedores/presentation/components/commission-summary-card";

export default function VendedoresPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("vendedores");

  // Sales report state
  const [reportFilters, setReportFilters] = useState({
    vendedorName: "",
    startDate: "",
    endDate: "",
  });
  const [reportPage, setReportPage] = useState(1);

  const debouncedVendedorName = useDebounce(reportFilters.vendedorName, 500);

  const {
    data: salesReport,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useVendedorSalesReport(
    debouncedVendedorName || undefined,
    reportFilters.startDate || undefined,
    reportFilters.endDate || undefined,
    reportPage,
    20,
  );

  const { data: commissionSummary, isLoading: isCommissionSummaryLoading } =
    useVendedorCommissionSummary();

  const handleFiltersChange = (filters: typeof reportFilters) => {
    setReportFilters(filters);
    setReportPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Vendedores
              </h1>
              {total !== null && activeTab === "vendedores" && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total} {total === 1 ? "cadastrado" : "cadastrados"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie os vendedores internos da empresa
            </p>
          </div>
        </div>

        {activeTab === "vendedores" && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novo Vendedor
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 h-auto sm:w-auto sm:grid-cols-none sm:inline-flex p-1">
          <TabsTrigger value="vendedores" className="gap-1.5 h-10 sm:h-9 text-sm">
            <UserCheck className="h-4 w-4 shrink-0" />
            <span>Vendedores</span>
          </TabsTrigger>
          <TabsTrigger value="sales-report" className="gap-1.5 h-10 sm:h-9 text-sm">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="sm:hidden">Rel. de Vendas</span>
            <span className="hidden sm:inline">Relatório de Vendas</span>
            {salesReport?.summary.totalOrders !== undefined && (
              <Badge variant="secondary" className="ml-1 text-xs font-medium">
                {salesReport.summary.totalOrders}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendedores" className="space-y-4">
          <VendedoresTable onTotalChange={setTotal} />
        </TabsContent>

        <TabsContent value="sales-report" className="space-y-4">
          <VendedorSalesReportFilters
            filters={reportFilters}
            onFiltersChange={handleFiltersChange}
          />
          <VendedorSalesReportSummary
            summary={
              salesReport?.summary ?? {
                totalOrders: 0,
                grossRevenue: 0,
                netRevenue: 0,
                totalCommission: 0,
                avgOrderValue: 0,
              }
            }
            isLoading={isReportLoading}
          >
            <VendedorCommissionSummaryCard
              summary={
                commissionSummary ?? {
                  totalCommissions: 0,
                  pendingCommissions: 0,
                  paidCommissions: 0,
                }
              }
              isLoading={isCommissionSummaryLoading}
            />
          </VendedorSalesReportSummary>
          <VendedorSalesReportTable
            orders={salesReport?.orders ?? []}
            isLoading={isReportLoading}
            isError={isReportError}
            page={reportPage}
            totalPages={salesReport?.totalPages ?? 1}
            onPageChange={setReportPage}
          />
        </TabsContent>
      </Tabs>

      {/* Mobile FAB */}
      {activeTab === "vendedores" && (
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
          aria-label="Novo Vendedor"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      )}

      <VendedorFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

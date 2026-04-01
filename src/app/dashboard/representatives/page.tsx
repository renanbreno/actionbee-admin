"use client";

import { useState } from "react";
import { Plus, Users, BarChart3, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepresentativesTable } from "@/contexts/representatives/presentation/components/representatives-table";
import { RepresentativeFormDialog } from "@/contexts/representatives/presentation/components/representative-form-dialog";
import { SalesReportFilters } from "@/contexts/representatives/presentation/components/sales-report-filters";
import { SalesReportSummary } from "@/contexts/representatives/presentation/components/sales-report-summary";
import { SalesReportTable } from "@/contexts/representatives/presentation/components/sales-report-table";
import { useSalesReport } from "@/contexts/representatives/presentation/hooks/use-sales-report";
import { Representative } from "@/contexts/representatives/domain/entities/representative";
import { useMarkRepresentativeCommissionPaid } from "@/contexts/representatives/presentation/hooks/use-mark-representative-commission-paid";
import { useCancelRepresentativeCommission } from "@/contexts/representatives/presentation/hooks/use-cancel-representative-commission";
import { useCommissionSummary } from "@/contexts/representatives/presentation/hooks/use-commission-summary";
import { useDownloadSalesReportPdf } from "@/contexts/representatives/presentation/hooks/use-download-sales-report-pdf";
import { CommissionSummaryCard } from "@/contexts/representatives/presentation/components/commission-summary-card";

export default function RepresentativesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("representatives");

  // Sales report state
  const [reportFilters, setReportFilters] = useState({
    representativeName: "",
    startDate: "",
    endDate: "",
  });
  const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null);
  const [reportPage, setReportPage] = useState(1);

  const {
    data: salesReport,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useSalesReport(
    selectedRepresentative?.id,
    undefined,
    reportFilters.startDate || undefined,
    reportFilters.endDate || undefined,
    reportPage,
    20,
  );

  const { data: commissionSummary, isLoading: isCommissionSummaryLoading } =
    useCommissionSummary({
      representativeId: selectedRepresentative?.id,
      startDate: reportFilters.startDate || undefined,
      endDate: reportFilters.endDate || undefined,
    });

  const { downloadPdf: downloadReportPdf, isPending: isPdfLoading } =
    useDownloadSalesReportPdf();

  // Representative commission mutations
  const markCommissionPaid = useMarkRepresentativeCommissionPaid();
  const cancelCommission = useCancelRepresentativeCommission();

  const handleMarkCommissionPaid = (orderId: string) => {
    markCommissionPaid.mutate(orderId);
  };

  const handleCancelCommission = (orderId: string) => {
    cancelCommission.mutate(orderId);
  };

  const handleFiltersChange = (filters: typeof reportFilters) => {
    setReportFilters(filters);
    setReportPage(1);
  };

  const handleRepresentativeSelect = (representative: Representative) => {
    setSelectedRepresentative(representative);
    setReportPage(1);
  };

  const handleRepresentativeClear = () => {
    setSelectedRepresentative(null);
    setReportPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Representantes
              </h1>
              {total !== null && activeTab === "representatives" && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total} {total === 1 ? "cadastrado" : "cadastrados"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie os representantes e suas carteiras de clientes
            </p>
          </div>
        </div>

        {activeTab === "representatives" && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novo Representante
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 h-auto sm:w-auto sm:grid-cols-none sm:inline-flex p-1">
          <TabsTrigger value="representatives" className="gap-1.5 h-10 sm:h-9 text-sm">
            <Users className="h-4 w-4 shrink-0" />
            <span>Representantes</span>
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

        <TabsContent value="representatives" className="space-y-4">
          <RepresentativesTable onTotalChange={setTotal} />
        </TabsContent>

        <TabsContent value="sales-report" className="space-y-4">
          <SalesReportFilters
            filters={reportFilters}
            selectedRepresentative={selectedRepresentative}
            onFiltersChange={handleFiltersChange}
            onRepresentativeSelect={handleRepresentativeSelect}
            onRepresentativeClear={handleRepresentativeClear}
          />
          <SalesReportSummary
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
            <CommissionSummaryCard
              summary={
                commissionSummary ?? {
                  totalCommissions: 0,
                  pendingCommissions: 0,
                  paidCommissions: 0,
                }
              }
              isLoading={isCommissionSummaryLoading}
            />
          </SalesReportSummary>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isPdfLoading}
              onClick={() => {
                downloadReportPdf({
                  representativeId: selectedRepresentative?.id,
                  startDate: reportFilters.startDate || undefined,
                  endDate: reportFilters.endDate || undefined,
                });
              }}
            >
              <FileDown className="h-4 w-4" />
              {isPdfLoading ? "Gerando PDF..." : "Exportar PDF"}
            </Button>
          </div>
          <SalesReportTable
            orders={salesReport?.orders ?? []}
            isLoading={isReportLoading}
            isError={isReportError}
            page={reportPage}
            totalPages={salesReport?.totalPages ?? 1}
            onPageChange={setReportPage}
            onMarkCommissionPaid={handleMarkCommissionPaid}
            onCancelCommission={handleCancelCommission}
            isMarkPending={markCommissionPaid.isPending}
            isCancelPending={cancelCommission.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Mobile FAB */}
      {activeTab === "representatives" && (
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
          aria-label="Novo Representante"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      )}

      <RepresentativeFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

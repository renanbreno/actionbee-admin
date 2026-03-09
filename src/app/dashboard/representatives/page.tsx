"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Plus, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepresentativesTable } from "@/contexts/representatives/presentation/components/representatives-table";
import { RepresentativeFormDialog } from "@/contexts/representatives/presentation/components/representative-form-dialog";
import { SalesReportFilters } from "@/contexts/representatives/presentation/components/sales-report-filters";
import { SalesReportSummary } from "@/contexts/representatives/presentation/components/sales-report-summary";
import { SalesReportTable } from "@/contexts/representatives/presentation/components/sales-report-table";
import { useSalesReport } from "@/contexts/representatives/presentation/hooks/use-sales-report";

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
  const [reportPage, setReportPage] = useState(1);

  const debouncedRepresentativeName = useDebounce(reportFilters.representativeName, 500);

  const { data: salesReport, isLoading: isReportLoading, isError: isReportError } = useSalesReport(
    debouncedRepresentativeName || undefined,
    reportFilters.startDate || undefined,
    reportFilters.endDate || undefined,
    reportPage,
    20,
  );

  // Reset page on filter change
  useEffect(() => {
    setReportPage(1);
  }, [debouncedRepresentativeName, reportFilters.startDate, reportFilters.endDate]);

  const handleFiltersChange = (filters: typeof reportFilters) => {
    setReportFilters(filters);
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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Representantes</h1>
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
        <TabsList>
          <TabsTrigger value="representatives" className="gap-1.5">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Representantes</span>
          </TabsTrigger>
          <TabsTrigger value="sales-report" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Relatório de Vendas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="representatives" className="space-y-4">
          <RepresentativesTable onTotalChange={setTotal} />
        </TabsContent>

        <TabsContent value="sales-report" className="space-y-4">
          <SalesReportFilters filters={reportFilters} onFiltersChange={handleFiltersChange} />
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
          />
          <SalesReportTable
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

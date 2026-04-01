"use client";

import { useState } from "react";
import { toast } from "sonner";
import { downloadSalesReportPdfUseCase } from "../../di";
import { SalesReportFilters } from "../../domain/entities/sales-report";

export function useDownloadSalesReportPdf() {
  const [isPending, setIsPending] = useState(false);

  async function downloadPdf(filters: SalesReportFilters) {
    setIsPending(true);
    try {
      const blob = await downloadSalesReportPdfUseCase.execute(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
      a.download = `relatorio-vendas-representante-${dateStr}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao gerar PDF do relatório";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  }

  return { downloadPdf, isPending };
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { downloadOrderPdfUseCase } from "../../di";

export function useDownloadOrderPdf() {
  const [isPending, setIsPending] = useState(false);

  async function downloadPdf(orderId: string, orderNumber: string) {
    setIsPending(true);
    try {
      const blob = await downloadOrderPdfUseCase.execute(orderId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pedido-${orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao gerar PDF do pedido";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  }

  return { downloadPdf, isPending };
}

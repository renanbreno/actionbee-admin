"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getShipmentLabelUseCase } from "../../di";

export function useGetShipmentLabel() {
  const [isPending, setIsPending] = useState(false);

  async function openLabel(orderId: string) {
    setIsPending(true);
    try {
      const { labelUrl } = await getShipmentLabelUseCase.execute(orderId);
      window.open(labelUrl, "_blank");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao obter etiqueta";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  }

  return { openLabel, isPending };
}

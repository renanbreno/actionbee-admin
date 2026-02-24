"use client";

import { Badge } from "@/components/ui/badge";
import { ShipmentStatus } from "../../domain/entities/affiliate-shipment";

const statusConfig: Record<
  ShipmentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/40",
  },
  SHIPPED: {
    label: "Enviado",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/40",
  },
  DELIVERED: {
    label: "Entregue",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/40",
  },
};

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
}

export function ShipmentStatusBadge({ status }: ShipmentStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Package, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AffiliateShipment,
  ShipmentStatus,
} from "../../domain/entities/affiliate-shipment";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { useUpdateShipmentStatus } from "../hooks/use-update-shipment-status";
import { useDeleteShipment } from "../hooks/use-delete-shipment";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
];

interface AffiliateShipmentsListProps {
  affiliateId: string;
  shipments: AffiliateShipment[];
  isLoading?: boolean;
}

function ShipmentCard({
  affiliateId,
  shipment,
}: {
  affiliateId: string;
  shipment: AffiliateShipment;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const updateStatus = useUpdateShipmentStatus(affiliateId);
  const deleteShipment = useDeleteShipment(affiliateId);

  const handleStatusChange = (status: ShipmentStatus) => {
    updateStatus.mutate(
      { shipmentId: shipment.id, status },
      {
        onSuccess: () => toast.success("Status atualizado"),
        onError: (err) =>
          toast.error(err.message || "Erro ao atualizar status"),
      },
    );
  };

  const handleDelete = () => {
    deleteShipment.mutate(shipment.id, {
      onSuccess: () => {
        toast.success("Bonificação excluída");
        setDeleteDialogOpen(false);
      },
      onError: (err) => toast.error(err.message || "Erro ao excluir"),
    });
  };

  const refDate = new Date(`${shipment.referenceMonth}-01`);
  const monthLabel = refDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <ShipmentStatusBadge status={shipment.status} />
              <span className="text-sm font-medium capitalize">{monthLabel}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Status dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    disabled={updateStatus.isPending}
                  >
                    Status
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => handleStatusChange(opt.value)}
                      className={
                        shipment.status === opt.value ? "font-semibold" : ""
                      }
                    >
                      {opt.label}
                      {shipment.status === opt.value && " ✓"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1">
            {shipment.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{item.productName}</span>
                  <span className="text-muted-foreground shrink-0">
                    × {item.quantity}
                  </span>
                </div>
                <span className="text-muted-foreground shrink-0 ml-2">
                  {brl.format(item.totalCost)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-2">
            <div className="text-xs text-muted-foreground">
              {shipment.notes && (
                <span className="italic">{shipment.notes}</span>
              )}
            </div>
            <div className="text-sm font-semibold">
              {brl.format(shipment.totalCost)}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Criado em{" "}
            {new Date(shipment.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir bonificação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A bonificação de{" "}
              <strong>{monthLabel}</strong> será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteShipment.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteShipment.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function AffiliateShipmentsList({
  affiliateId,
  shipments,
  isLoading,
}: AffiliateShipmentsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Nenhuma bonificação encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {shipments.map((shipment) => (
        <ShipmentCard
          key={shipment.id}
          affiliateId={affiliateId}
          shipment={shipment}
        />
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderListItem, OrderStatus, VALID_TRANSITIONS } from "../../domain/entities/order";
import { useUpdateOrderStatus } from "../hooks/use-update-order-status";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

interface UpdateOrderStatusDialogProps {
  order: OrderListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateOrderStatusDialog({
  order,
  open,
  onOpenChange,
}: UpdateOrderStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [trackingCode, setTrackingCode] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const updateStatusMutation = useUpdateOrderStatus();

  const validTransitions = order
    ? VALID_TRANSITIONS[order.status] ?? []
    : [];

  function handleClose() {
    setNewStatus("");
    setTrackingCode("");
    setCancellationReason("");
    onOpenChange(false);
  }

  function handleSubmit() {
    if (!order || !newStatus) return;

    const params: { status: string; trackingCode?: string; cancellationReason?: string } = {
      status: newStatus,
    };

    if (newStatus === "SHIPPED" && trackingCode) {
      params.trackingCode = trackingCode;
    }

    if (newStatus === "CANCELLED" && cancellationReason) {
      params.cancellationReason = cancellationReason;
    }

    updateStatusMutation.mutate(
      { id: order.id, params },
      {
        onSuccess: () => handleClose(),
      }
    );
  }

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Status do Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedido:</span>
              <span className="font-mono font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Status atual:</span>
              <span className="font-medium">{STATUS_LABELS[order.status]}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newStatus">Novo Status</Label>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as OrderStatus)}
            >
              <SelectTrigger id="newStatus">
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {validTransitions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newStatus === "SHIPPED" && (
            <div className="space-y-2">
              <Label htmlFor="trackingCode">
                Código de Rastreio
                <span className="text-muted-foreground text-xs ml-1">(opcional)</span>
              </Label>
              <Input
                id="trackingCode"
                placeholder="Ex: BR123456789"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
            </div>
          )}

          {newStatus === "CANCELLED" && (
            <div className="space-y-2">
              <Label htmlFor="cancellationReason">
                Motivo do Cancelamento
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="cancellationReason"
                placeholder="Informe o motivo do cancelamento..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={updateStatusMutation.isPending}
            className="flex-1 sm:flex-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !newStatus ||
              updateStatusMutation.isPending ||
              (newStatus === "CANCELLED" && !cancellationReason)
            }
            className="flex-1 sm:flex-auto"
          >
            {updateStatusMutation.isPending ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

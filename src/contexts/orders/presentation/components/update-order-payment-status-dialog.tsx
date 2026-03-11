"use client";

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderListItem, PaymentStatus } from "../../domain/entities/order";
import { useUpdateOrderPaymentStatus } from "../hooks/use-update-order-payment-status";

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  WAITING: "Aguardando pagamento",
  IN_ANALYSIS: "Em análise",
  AUTHORIZED: "Autorizado",
  PAID: "Pago",
  DECLINED: "Recusado",
  CANCELED: "Cancelado",
};

interface UpdateOrderPaymentStatusDialogProps {
  order: OrderListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateOrderPaymentStatusDialog({
  order,
  open,
  onOpenChange,
}: UpdateOrderPaymentStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<PaymentStatus | "">("");

  const updatePaymentStatusMutation = useUpdateOrderPaymentStatus();

  const allStatuses: PaymentStatus[] = [
    "WAITING",
    "IN_ANALYSIS",
    "AUTHORIZED",
    "PAID",
    "DECLINED",
    "CANCELED",
  ];

  function handleClose() {
    setNewStatus("");
    onOpenChange(false);
  }

  function handleSubmit() {
    if (!order || !newStatus) return;

    updatePaymentStatusMutation.mutate(
      { id: order.id, params: { paymentStatus: newStatus } },
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
          <DialogTitle>Atualizar Status do Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedido:</span>
              <span className="font-mono font-medium">{order.orderNumber}</span>
            </div>
            {order.paymentStatus && (
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground">Status atual:</span>
                <span className="font-medium">
                  {PAYMENT_STATUS_LABELS[order.paymentStatus as PaymentStatus] ?? order.paymentStatus}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newStatus">Novo Status</Label>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as PaymentStatus)}
            >
              <SelectTrigger id="newStatus">
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {PAYMENT_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(newStatus === 'PAID' || newStatus === 'AUTHORIZED') && order.status === 'PENDING' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <p className="font-medium">O status do pedido será atualizado para CONFIRMED</p>
              <p className="text-xs mt-1">Pagamentos aprovados confirmam automaticamente o pedido.</p>
            </div>
          )}

          {(newStatus === 'CANCELED' || newStatus === 'DECLINED') &&
            (order.status === 'PENDING' || order.status === 'CONFIRMED') && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                <p className="font-medium">O status do pedido será atualizado para CANCELLED</p>
                <p className="text-xs mt-1">Pagamentos recusados ou cancelados cancelam automaticamente o pedido.</p>
              </div>
            )}
        </div>

        <DialogActions
          isLoading={updatePaymentStatusMutation.isPending}
          loadingText="Salvando..."
          submitLabel="Confirmar"
          onCancel={handleClose}
          onSubmit={(e) => {
            e.preventDefault();
            if (newStatus && !updatePaymentStatusMutation.isPending) {
              handleSubmit();
            }
          }}
          submitButtonType="button"
          submitButtonProps={{
            className: "flex-1 sm:flex-auto",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

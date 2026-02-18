"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmationType = "mark-paid" | "cancel";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConfirmationType;
  orderNumber: string;
  customerName: string;
  commissionAmount: string;
  onConfirm: () => void;
  isPending?: boolean;
}

const DIALOG_CONFIG = {
  "mark-paid": {
    title: "Marcar Comissão como Paga",
    icon: CheckCircle,
    iconClass: "text-emerald-600 bg-emerald-500/10",
    description: "Confirme o pagamento da comissão abaixo.",
    confirmText: "Confirmar Pagamento",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  cancel: {
    title: "Cancelar Comissão",
    icon: XCircle,
    iconClass: "text-red-600 bg-red-500/10",
    description: "Esta ação não pode ser desfeita.",
    confirmText: "Cancelar Comissão",
    confirmClass: "bg-destructive hover:bg-destructive/90 text-white",
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  type,
  orderNumber,
  customerName,
  commissionAmount,
  onConfirm,
  isPending = false,
}: ConfirmationDialogProps) {
  const config = DIALOG_CONFIG[type];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.iconClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pedido:</span>
            <span className="font-mono font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          {type === "mark-paid" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Comissão:</span>
              <span className="font-semibold text-bee-gold">{commissionAmount}</span>
            </div>
          )}
        </div>

        {type === "cancel" && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              Ao cancelar, a comissão será removida e não poderá mais ser paga.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1 sm:flex-auto"
          >
            Voltar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className={cn("flex-1 sm:flex-auto", config.confirmClass)}
          >
            {isPending ? "Processando..." : config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

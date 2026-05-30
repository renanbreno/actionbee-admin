"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { PayReceivableDialog } from "./pay-receivable-dialog";
import { useCancelReceivable, useReverseReceivable } from "../hooks/use-account-receivables";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BOLETO: "Boleto",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
    OVERDUE: "border-red-500/30 bg-red-500/10 text-red-600",
    CANCELLED: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500",
  };
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", colors[status] ?? "")}>
      {FINANCIAL_STATUS_LABELS[status as keyof typeof FINANCIAL_STATUS_LABELS] ?? status}
    </Badge>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entries: AccountReceivable[];
  description: string;
}

export function ReceivableOrderSheet({ open, onOpenChange, entries, description }: Props) {
  const cancelMutation = useCancelReceivable();
  const reverseMutation = useReverseReceivable();

  const [payingEntry, setPayingEntry] = useState<AccountReceivable | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [cancellingEntry, setCancellingEntry] = useState<AccountReceivable | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reversingEntry, setReversingEntry] = useState<AccountReceivable | null>(null);
  const [reverseOpen, setReverseOpen] = useState(false);

  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
  const paidAmount = entries.reduce((sum, e) => sum + (e.status === "PAID" ? (e.paidAmount ?? e.amount) : 0), 0);
  const hasPaid = paidAmount > 0;
  const allPaid = entries.every((e) => e.status === "PAID" || e.status === "CANCELLED");
  const paidPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  const handleCancelConfirm = () => {
    if (!cancellingEntry) return;
    cancelMutation.mutate(cancellingEntry.id, {
      onSuccess: () => { setCancelOpen(false); setCancellingEntry(null); },
    });
  };

  const handleReverseConfirm = () => {
    if (!reversingEntry) return;
    reverseMutation.mutate(reversingEntry.id, {
      onSuccess: () => { setReverseOpen(false); setReversingEntry(null); },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-base">{description}</SheetTitle>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-emerald-600">{formatCurrency(totalAmount)}</span>
              {hasPaid && !allPaid && (
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(paidAmount)} recebido
                </span>
              )}
            </div>
            {hasPaid && !allPaid && (
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {entries.map((entry) => {
              const isPendingOrOverdue = entry.status === "PENDING" || entry.status === "OVERDUE";
              const isPaid = entry.status === "PAID";
              const methodLabel = entry.paymentMethod
                ? (PAYMENT_METHOD_LABELS[entry.paymentMethod] ?? entry.paymentMethod)
                : "Não informado";

              return (
                <div
                  key={entry.id}
                  className="rounded-xl border bg-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold">{methodLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        Vence {formatDate(entry.dueDate)}
                        {entry.paidAt && ` · Pago em ${formatDate(entry.paidAt)}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={cn(
                        "text-sm font-bold",
                        isPaid ? "text-emerald-600" : "text-foreground"
                      )}>
                        {formatCurrency(entry.amount)}
                      </span>
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isPendingOrOverdue && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 border-emerald-500/40 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => { setPayingEntry(entry); setPayOpen(true); }}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Dar baixa
                      </Button>
                    )}
                    {isPaid && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={() => { setReversingEntry(entry); setReverseOpen(true); }}
                      >
                        <RotateCcw className="h-3 w-3" />
                        Estornar
                      </Button>
                    )}
                    {isPendingOrOverdue && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
                        onClick={() => { setCancellingEntry(entry); setCancelOpen(true); }}
                      >
                        <XCircle className="h-3 w-3" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <PayReceivableDialog
        receivable={payingEntry}
        open={payOpen}
        onOpenChange={setPayOpen}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar lançamento</AlertDialogTitle>
            <AlertDialogDescription>
              Cancelar o recebimento via{" "}
              <strong>{cancellingEntry?.paymentMethod ? (PAYMENT_METHOD_LABELS[cancellingEntry.paymentMethod] ?? cancellingEntry.paymentMethod) : ""}</strong>{" "}
              de <strong>{cancellingEntry ? formatCurrency(cancellingEntry.amount) : ""}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={reverseOpen} onOpenChange={setReverseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estornar recebimento</AlertDialogTitle>
            <AlertDialogDescription>
              Estornar o recebimento via{" "}
              <strong>{reversingEntry?.paymentMethod ? (PAYMENT_METHOD_LABELS[reversingEntry.paymentMethod] ?? reversingEntry.paymentMethod) : ""}</strong>{" "}
              de <strong>{reversingEntry ? formatCurrency(reversingEntry.amount) : ""}</strong>? Esta ação marcará como cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reverseMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReverseConfirm}
              disabled={reverseMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar estorno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

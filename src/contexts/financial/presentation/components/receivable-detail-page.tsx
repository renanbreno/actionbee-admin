"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReceivableDetail, useReceivablesByOrder } from "../hooks/use-account-receivables";
import { PayReceivableDialog } from "./pay-receivable-dialog";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import { useCancelReceivable, useReverseReceivable } from "../hooks/use-account-receivables";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, CheckCircle, XCircle, RotateCcw, AlertTriangle,
  Calendar, CreditCard, Banknote, Tag, Building2, FileText, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BOLETO: "Boleto",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
};

const PAYMENT_METHOD_ICONS: Record<string, typeof CreditCard> = {
  BOLETO: Banknote,
  PIX: Banknote,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
  const colors: Record<string, string> = {
    PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
    OVERDUE: "border-red-500/30 bg-red-500/10 text-red-600",
    CANCELLED: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        size === "lg" ? "text-sm px-3 py-1" : "text-xs",
        colors[status] ?? "",
      )}
    >
      {FINANCIAL_STATUS_LABELS[status as keyof typeof FINANCIAL_STATUS_LABELS] ?? status}
    </Badge>
  );
}

function aggregateStatus(entries: AccountReceivable[]): string {
  const statuses = entries.map((e) => e.status);
  if (statuses.every((s) => s === "CANCELLED")) return "CANCELLED";
  if (statuses.every((s) => s === "PAID" || s === "CANCELLED")) return "PAID";
  if (statuses.some((s) => s === "OVERDUE")) return "OVERDUE";
  return "PENDING";
}

interface Props {
  receivableId: string;
}

export function ReceivableDetailPage({ receivableId }: Props) {
  const router = useRouter();
  const { data: receivable, isLoading, isError } = useReceivableDetail(receivableId);
  const { data: orderSiblings } = useReceivablesByOrder(receivable?.orderId ?? null);

  const entries = orderSiblings && orderSiblings.length > 1 ? orderSiblings : receivable ? [receivable] : [];
  const isGrouped = entries.length > 1;

  const totalAmount = entries.reduce((s, e) => s + e.amount, 0);
  const paidTotal = entries.reduce((s, e) => s + (e.status === "PAID" ? (e.paidAmount ?? e.amount) : 0), 0);
  const hasPaid = paidTotal > 0;
  const paidPercent = totalAmount > 0 ? Math.round((paidTotal / totalAmount) * 100) : 0;
  const overallStatus = isGrouped ? aggregateStatus(entries) : (receivable?.status ?? "PENDING");

  const [payingEntry, setPayingEntry] = useState<AccountReceivable | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [cancellingEntry, setCancellingEntry] = useState<AccountReceivable | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reversingEntry, setReversingEntry] = useState<AccountReceivable | null>(null);
  const [reverseOpen, setReverseOpen] = useState(false);

  const cancelMutation = useCancelReceivable();
  const reverseMutation = useReverseReceivable();

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

  if (isLoading) return <DetailSkeleton />;

  if (isError || !receivable) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Conta a receber não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      {/* Header card */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-xl font-bold tracking-tight leading-snug">
                {receivable.description}
              </h1>
            </div>
            <StatusBadge status={overallStatus} size="lg" />
          </div>

          <div className="mt-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {formatCurrency(totalAmount)}
            </p>
            {hasPaid && paidTotal < totalAmount && (
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(paidTotal)} recebido · {formatCurrency(totalAmount - paidTotal)} restante
              </p>
            )}
            {hasPaid && paidTotal >= totalAmount && (
              <p className="text-sm text-emerald-600 font-medium mt-1">
                Totalmente recebido
              </p>
            )}
          </div>

          {hasPaid && paidTotal < totalAmount && (
            <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, paidPercent)}%` }}
              />
            </div>
          )}
        </div>

        {/* Info grid — only for single receivable */}
        {!isGrouped && (
          <>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
              <InfoCell icon={Tag} label="Categoria" value={receivable.categoryName} />
              <InfoCell
                icon={receivable.paymentMethod ? (PAYMENT_METHOD_ICONS[receivable.paymentMethod] ?? CreditCard) : CreditCard}
                label="Método"
                value={receivable.paymentMethod ? (PAYMENT_METHOD_LABELS[receivable.paymentMethod] ?? receivable.paymentMethod) : "Não informado"}
              />
              <InfoCell
                icon={Calendar}
                label="Vencimento"
                value={formatDate(receivable.dueDate)}
                highlight={receivable.status === "OVERDUE"}
              />
              {receivable.accountName && (
                <InfoCell icon={Building2} label="Conta" value={receivable.accountName} />
              )}
              {receivable.status === "PAID" && receivable.paidAt && (
                <InfoCell icon={CheckCircle} label="Recebido em" value={formatDate(receivable.paidAt)} />
              )}
              {receivable.status === "PAID" && receivable.paidAmount != null && (
                <InfoCell icon={Banknote} label="Valor recebido" value={formatCurrency(receivable.paidAmount)} />
              )}
              {receivable.notes && (
                <InfoCell icon={FileText} label="Notas" value={receivable.notes} span2 />
              )}
              <InfoCell icon={Clock} label="Criado em" value={formatDate(receivable.createdAt)} muted />
            </div>
          </>
        )}
      </div>

      {/* Single receivable actions */}
      {!isGrouped && (
        <EntryActions
          entry={receivable}
          onPay={() => { setPayingEntry(receivable); setPayOpen(true); }}
          onCancel={() => { setCancellingEntry(receivable); setCancelOpen(true); }}
          onReverse={() => { setReversingEntry(receivable); setReverseOpen(true); }}
        />
      )}

      {/* Grouped: payment method cards */}
      {isGrouped && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Formas de pagamento
          </h2>
          {entries.map((entry) => (
            <PaymentMethodCard
              key={entry.id}
              entry={entry}
              onPay={() => { setPayingEntry(entry); setPayOpen(true); }}
              onCancel={() => { setCancellingEntry(entry); setCancelOpen(true); }}
              onReverse={() => { setReversingEntry(entry); setReverseOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
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
              <strong>
                {cancellingEntry?.paymentMethod
                  ? (PAYMENT_METHOD_LABELS[cancellingEntry.paymentMethod] ?? cancellingEntry.paymentMethod)
                  : ""}
              </strong>{" "}
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
              {cancelMutation.isPending ? "Cancelando..." : "Confirmar cancelamento"}
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
              <strong>
                {reversingEntry?.paymentMethod
                  ? (PAYMENT_METHOD_LABELS[reversingEntry.paymentMethod] ?? reversingEntry.paymentMethod)
                  : ""}
              </strong>{" "}
              de <strong>{reversingEntry ? formatCurrency(reversingEntry.amount) : ""}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reverseMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReverseConfirm}
              disabled={reverseMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {reverseMutation.isPending ? "Estornando..." : "Confirmar estorno"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function PaymentMethodCard({
  entry,
  onPay,
  onCancel,
  onReverse,
}: {
  entry: AccountReceivable;
  onPay: () => void;
  onCancel: () => void;
  onReverse: () => void;
}) {
  const isPendingOrOverdue = entry.status === "PENDING" || entry.status === "OVERDUE";
  const isPaid = entry.status === "PAID";
  const isCancelled = entry.status === "CANCELLED";
  const methodLabel = entry.paymentMethod
    ? (PAYMENT_METHOD_LABELS[entry.paymentMethod] ?? entry.paymentMethod)
    : "Não informado";
  const MethodIcon = entry.paymentMethod
    ? (PAYMENT_METHOD_ICONS[entry.paymentMethod] ?? CreditCard)
    : CreditCard;

  return (
    <div className={cn(
      "rounded-xl border bg-card shadow-sm overflow-hidden transition-colors",
      isCancelled && "opacity-60",
    )}>
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn(
              "flex items-center justify-center rounded-lg h-10 w-10 shrink-0",
              isPaid ? "bg-emerald-500/10" : isPendingOrOverdue ? "bg-amber-500/10" : "bg-muted",
            )}>
              <MethodIcon className={cn(
                "h-5 w-5",
                isPaid ? "text-emerald-600" : isPendingOrOverdue ? "text-amber-600" : "text-muted-foreground",
              )} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{methodLabel}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vence em {formatDate(entry.dueDate)}
                {entry.paidAt && ` · Pago em ${formatDate(entry.paidAt)}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={cn(
              "text-base font-bold",
              isPaid ? "text-emerald-600" : "text-foreground",
            )}>
              {formatCurrency(entry.amount)}
            </span>
            <StatusBadge status={entry.status} />
          </div>
        </div>

        {isPaid && entry.paidAmount != null && entry.paidAmount < entry.amount && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, Math.round((entry.paidAmount / entry.amount) * 100))}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatCurrency(entry.paidAmount)} de {formatCurrency(entry.amount)}
            </span>
          </div>
        )}

        {/* Actions */}
        {(isPendingOrOverdue || isPaid) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {isPendingOrOverdue && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={onPay}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Dar baixa
              </Button>
            )}
            {isPendingOrOverdue && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={onCancel}
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancelar
              </Button>
            )}
            {isPaid && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={onReverse}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Estornar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EntryActions({
  entry,
  onPay,
  onCancel,
  onReverse,
}: {
  entry: AccountReceivable;
  onPay: () => void;
  onCancel: () => void;
  onReverse: () => void;
}) {
  const isPendingOrOverdue = entry.status === "PENDING" || entry.status === "OVERDUE";
  const isPaid = entry.status === "PAID";

  if (!isPendingOrOverdue && !isPaid) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {isPendingOrOverdue && (
        <Button
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-initial"
          onClick={onPay}
        >
          <CheckCircle className="h-4 w-4" />
          Dar Baixa
        </Button>
      )}
      {isPendingOrOverdue && (
        <Button
          variant="outline"
          className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={onCancel}
        >
          <XCircle className="h-4 w-4" />
          Cancelar
        </Button>
      )}
      {isPaid && (
        <Button
          variant="outline"
          className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={onReverse}
        >
          <RotateCcw className="h-4 w-4" />
          Estornar recebimento
        </Button>
      )}
    </div>
  );
}

function InfoCell({
  icon: Icon,
  label,
  value,
  highlight,
  muted,
  span2,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
  span2?: boolean;
}) {
  return (
    <div className={cn("bg-card p-4", span2 && "col-span-2")}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={cn(
        "text-sm font-medium",
        highlight ? "text-red-600" : muted ? "text-muted-foreground" : "text-foreground",
      )}>
        {value}
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full animate-pulse">
      <div className="h-4 w-16 rounded bg-muted" />
      <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-2/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="h-10 w-1/3 rounded bg-muted" />
        <div className="h-2 w-full rounded-full bg-muted" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border bg-card shadow-sm p-5 space-y-3">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
            <div className="h-5 w-20 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

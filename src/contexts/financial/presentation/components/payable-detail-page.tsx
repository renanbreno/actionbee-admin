"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePayableDetail, useCancelPayable } from "../hooks/use-account-payables";
import { PayPayableDialog } from "./pay-payable-dialog";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  Calendar, Banknote, Tag, Building2, FileText, Clock, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface Props {
  payableId: string;
}

export function PayableDetailPage({ payableId }: Props) {
  const router = useRouter();
  const { data: payable, isLoading, isError } = usePayableDetail(payableId);

  const [payOpen, setPayOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const cancelMutation = useCancelPayable();

  const handleCancelConfirm = () => {
    if (!payable) return;
    cancelMutation.mutate(payable.id, {
      onSuccess: () => setCancelOpen(false),
    });
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !payable) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Conta a pagar não encontrada</p>
        </div>
      </div>
    );
  }

  const isPendingOrOverdue = payable.status === "PENDING" || payable.status === "OVERDUE";

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
                {payable.description}
              </h1>
            </div>
            <StatusBadge status={payable.status} size="lg" />
          </div>

          <div className="mt-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {formatCurrency(payable.amount)}
            </p>
            {payable.status === "PAID" && payable.paidAmount != null && payable.paidAmount < payable.amount && (
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(payable.paidAmount)} pago · {formatCurrency(payable.amount - payable.paidAmount)} restante
              </p>
            )}
            {payable.status === "PAID" && (payable.paidAmount == null || payable.paidAmount >= payable.amount) && (
              <p className="text-sm text-emerald-600 font-medium mt-1">
                Totalmente pago
              </p>
            )}
          </div>
        </div>

        {/* Info grid */}
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
          <InfoCell icon={Tag} label="Categoria" value={payable.categoryName} />
          <InfoCell
            icon={Truck}
            label="Fornecedor"
            value={payable.supplierName ?? "Não informado"}
          />
          <InfoCell
            icon={Calendar}
            label="Vencimento"
            value={formatDate(payable.dueDate)}
            highlight={payable.status === "OVERDUE"}
          />
          {payable.accountName && (
            <InfoCell icon={Building2} label="Conta" value={payable.accountName} />
          )}
          {payable.status === "PAID" && payable.paidAt && (
            <InfoCell icon={CheckCircle} label="Pago em" value={formatDate(payable.paidAt)} />
          )}
          {payable.status === "PAID" && payable.paidAmount != null && (
            <InfoCell icon={Banknote} label="Valor pago" value={formatCurrency(payable.paidAmount)} />
          )}
          {payable.notes && (
            <InfoCell icon={FileText} label="Notas" value={payable.notes} span2 />
          )}
          <InfoCell icon={Clock} label="Criado em" value={formatDate(payable.createdAt)} muted />
        </div>
      </div>

      {/* Actions */}
      {isPendingOrOverdue && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-initial"
            onClick={() => setPayOpen(true)}
          >
            <CheckCircle className="h-4 w-4" />
            Dar Baixa
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
            onClick={() => setCancelOpen(true)}
          >
            <XCircle className="h-4 w-4" />
            Cancelar
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <PayPayableDialog
        payable={payable}
        open={payOpen}
        onOpenChange={setPayOpen}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar conta a pagar</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar <strong>{payable.description}</strong> de{" "}
              <strong>{formatCurrency(payable.amount)}</strong>?
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
    </div>
  );
}

/* --- Sub-components --- */

function InfoCell({
  icon: Icon,
  label,
  value,
  highlight,
  muted,
  span2,
}: {
  icon: typeof Tag;
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
      </div>
      <div className="rounded-xl border bg-card shadow-sm p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

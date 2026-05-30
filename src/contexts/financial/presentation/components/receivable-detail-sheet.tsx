"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { payReceivableSchema, type PayReceivableFormValues } from "../schemas/receivable.schema";
import {
  usePayReceivable, useCancelReceivable, useReverseReceivable,
} from "../hooks/use-account-receivables";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { maskDate, unmaskDate, formatDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BOLETO: "Boleto",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDateStr(dateStr: string) {
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

type ActionPanel = "none" | "pay" | "cancel" | "reverse";

interface Props {
  receivable: AccountReceivable | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ReceivableDetailSheet({ receivable, open, onOpenChange }: Props) {
  const [activePanel, setActivePanel] = useState<ActionPanel>("none");

  const payMutation = usePayReceivable();
  const cancelMutation = useCancelReceivable();
  const reverseMutation = useReverseReceivable();
  const { data: accounts = [] } = useFinancialAccounts();
  const activeAccounts = accounts.filter((a) => a.active);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PayReceivableFormValues>({
    resolver: zodResolver(payReceivableSchema),
    defaultValues: { paidAt: "", paidAmount: "", accountId: "" },
  });

  const accountValue = watch("accountId");

  useEffect(() => {
    if (receivable && open) {
      reset({
        paidAt: formatDate(new Date()),
        paidAmount: maskCurrency(Math.round(receivable.amount * 100).toString()),
        accountId: receivable.accountId ?? "",
      });
      setActivePanel("none");
    }
  }, [receivable, open, reset]);

  if (!receivable) return null;

  const isPendingOrOverdue = receivable.status === "PENDING" || receivable.status === "OVERDUE";
  const isPaid = receivable.status === "PAID";
  const isPartialPay = isPaid && receivable.paidAmount != null && receivable.paidAmount < receivable.amount;
  const remaining = isPartialPay ? receivable.amount - (receivable.paidAmount ?? 0) : 0;

  function handlePaySubmit(values: PayReceivableFormValues) {
    payMutation.mutate(
      {
        id: receivable!.id,
        data: {
          paidAt: unmaskDate(values.paidAt) ?? values.paidAt,
          paidAmount: currencyToNumber(values.paidAmount),
          accountId: values.accountId || undefined,
        },
      },
      { onSuccess: () => { setActivePanel("none"); onOpenChange(false); } },
    );
  }

  function handleCancel() {
    cancelMutation.mutate(receivable!.id, {
      onSuccess: () => { setActivePanel("none"); onOpenChange(false); },
    });
  }

  function handleReverse() {
    reverseMutation.mutate(receivable!.id, {
      onSuccess: () => { setActivePanel("none"); onOpenChange(false); },
    });
  }

  const methodLabel = receivable.paymentMethod
    ? (PAYMENT_METHOD_LABELS[receivable.paymentMethod] ?? receivable.paymentMethod)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-y-auto">

        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b">
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-base leading-snug flex-1 min-w-0">
              {receivable.description}
            </SheetTitle>
            <StatusBadge status={receivable.status} />
          </div>
          <div className="flex items-end justify-between mt-1">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(receivable.amount)}
              </p>
              {isPartialPay && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCurrency(receivable.paidAmount!)} recebido · {formatCurrency(remaining)} restante
                </p>
              )}
            </div>
          </div>
          {isPartialPay && (
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, Math.round(((receivable.paidAmount ?? 0) / receivable.amount) * 100))}%` }}
              />
            </div>
          )}
        </SheetHeader>

        {/* Details */}
        <div className="px-6 py-5 space-y-3">
          <DetailRow label="Categoria" value={receivable.categoryName} />
          {methodLabel && <DetailRow label="Método" value={methodLabel} />}
          <DetailRow label="Vencimento" value={formatDateStr(receivable.dueDate)} highlight={receivable.status === "OVERDUE"} />
          {receivable.accountName && <DetailRow label="Conta" value={receivable.accountName} />}
          {isPaid && receivable.paidAt && (
            <DetailRow label="Data de recebimento" value={formatDateStr(receivable.paidAt)} />
          )}
          {isPaid && receivable.paidAmount != null && (
            <DetailRow
              label="Valor recebido"
              value={formatCurrency(receivable.paidAmount)}
              highlight={isPartialPay}
            />
          )}
          {receivable.notes && <DetailRow label="Notas" value={receivable.notes} />}
          <DetailRow label="Criado em" value={formatDateStr(receivable.createdAt)} muted />
        </div>

        <Separator />

        {/* Actions */}
        <div className="px-6 py-5 space-y-3 flex-1">

          {isPendingOrOverdue && activePanel === "none" && (
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setActivePanel("pay")}
              >
                <CheckCircle className="h-4 w-4" />
                Dar Baixa
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => setActivePanel("cancel")}
              >
                <XCircle className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}

          {isPaid && activePanel === "none" && (
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={() => setActivePanel("reverse")}
            >
              <RotateCcw className="h-4 w-4" />
              Estornar recebimento
            </Button>
          )}

          {/* Pay panel */}
          {activePanel === "pay" && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
              <p className="text-sm font-medium">Registrar recebimento</p>
              <form onSubmit={handleSubmit(handlePaySubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Data <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="dd/mm/aaaa"
                      maxLength={10}
                      className="h-9 text-sm"
                      {...register("paidAt", { onChange: (e) => setValue("paidAt", maskDate(e.target.value)) })}
                    />
                    {errors.paidAt && <p className="text-xs text-destructive">{errors.paidAt.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Valor recebido <span className="text-destructive">*</span></Label>
                    <Input
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      className="h-9 text-sm"
                      {...register("paidAmount", { onChange: (e) => setValue("paidAmount", maskCurrency(e.target.value)) })}
                    />
                    {errors.paidAmount && <p className="text-xs text-destructive">{errors.paidAmount.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Conta <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                  <Select
                    value={accountValue ?? "_none"}
                    onValueChange={(v) => setValue("accountId", v === "_none" ? undefined : v)}
                  >
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecionar conta" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Nenhuma</SelectItem>
                      {activeAccounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={payMutation.isPending}>
                    {payMutation.isPending ? "Salvando..." : "Confirmar"}
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setActivePanel("none")} disabled={payMutation.isPending}>
                    Voltar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Cancel confirmation panel */}
          {activePanel === "cancel" && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">Cancelar este lançamento?</p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Esta ação não pode ser desfeita. O lançamento será marcado como cancelado.
              </p>
              <div className="flex gap-2 pl-6">
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "Cancelando..." : "Confirmar cancelamento"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setActivePanel("none")} disabled={cancelMutation.isPending}>
                  Voltar
                </Button>
              </div>
            </div>
          )}

          {/* Reverse confirmation panel */}
          {activePanel === "reverse" && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">Estornar este recebimento?</p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                O recebimento será revertido e o lançamento voltará a aparecer como cancelado.
              </p>
              <div className="flex gap-2 pl-6">
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleReverse}
                  disabled={reverseMutation.isPending}
                >
                  {reverseMutation.isPending ? "Estornando..." : "Confirmar estorno"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setActivePanel("none")} disabled={reverseMutation.isPending}>
                  Voltar
                </Button>
              </div>
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted-foreground shrink-0 pt-px">{label}</span>
      <span className={cn(
        "text-sm text-right",
        highlight ? "text-amber-600 font-medium" : muted ? "text-muted-foreground" : "font-medium",
      )}>
        {value}
      </span>
    </div>
  );
}

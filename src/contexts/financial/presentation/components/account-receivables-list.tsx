"use client";

import { useState } from "react";
import { useAccountReceivables, useCancelReceivable, useReverseReceivable } from "../hooks/use-account-receivables";
import { CreateReceivableDialog } from "./create-receivable-dialog";
import { PayReceivableDialog } from "./pay-receivable-dialog";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, MoreHorizontal, CheckCircle, XCircle, TrendingUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const RECEIVABLE_STATUS_FILTERS = [
  { value: undefined, label: "Todos", dot: "bg-zinc-400", activeClass: "border-zinc-300 bg-zinc-100 text-zinc-700" },
  { value: "PENDING", label: "Pendente", dot: "bg-amber-500", activeClass: "border-amber-500/30 bg-amber-500/10 text-amber-700" },
  { value: "OVERDUE", label: "Vencido", dot: "bg-red-500", activeClass: "border-red-500/30 bg-red-500/10 text-red-700" },
  { value: "PAID", label: "Pago", dot: "bg-emerald-500", activeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" },
  { value: "CANCELLED", label: "Cancelado", dot: "bg-muted-foreground/40", activeClass: "border-zinc-200 bg-zinc-50 text-zinc-500" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
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

export function AccountReceivablesList() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dueDateFrom, setDueDateFrom] = useState<string>("");
  const [dueDateTo, setDueDateTo] = useState<string>("");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");

  const filters = {
    ...(statusFilter && { status: statusFilter }),
    ...(dueDateFrom && { dueDateFrom }),
    ...(dueDateTo && { dueDateTo }),
    ...(orderIdFilter && { orderId: orderIdFilter }),
  };
  const { data: receivables = [], isLoading, isError } = useAccountReceivables(Object.keys(filters).length ? filters : undefined);
  const cancelMutation = useCancelReceivable();
  const reverseMutation = useReverseReceivable();

  const [createOpen, setCreateOpen] = useState(false);
  const [payingReceivable, setPayingReceivable] = useState<AccountReceivable | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [cancellingReceivable, setCancellingReceivable] = useState<AccountReceivable | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reversingReceivable, setReversingReceivable] = useState<AccountReceivable | null>(null);
  const [reverseOpen, setReverseOpen] = useState(false);

  const handlePay = (r: AccountReceivable) => { setPayingReceivable(r); setPayOpen(true); };
  const handleCancelRequest = (r: AccountReceivable) => { setCancellingReceivable(r); setCancelOpen(true); };
  const handleCancelConfirm = () => {
    if (!cancellingReceivable) return;
    cancelMutation.mutate(cancellingReceivable.id, {
      onSuccess: () => { setCancelOpen(false); setCancellingReceivable(null); },
    });
  };
  const handleReverseRequest = (r: AccountReceivable) => { setReversingReceivable(r); setReverseOpen(true); };
  const handleReverseConfirm = () => {
    if (!reversingReceivable) return;
    reverseMutation.mutate(reversingReceivable.id, {
      onSuccess: () => { setReverseOpen(false); setReversingReceivable(null); },
    });
  };

  function ReceivableActions({ receivable }: { receivable: AccountReceivable }) {
    const isPendingOrOverdue = receivable.status === "PENDING" || receivable.status === "OVERDUE";
    const isPaid = receivable.status === "PAID";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {!isPaid && (
            <DropdownMenuItem
              disabled={!isPendingOrOverdue}
              onClick={() => handlePay(receivable)}
            >
              <CheckCircle className="mr-2 h-3.5 w-3.5 text-emerald-600" />Registrar recebimento
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {isPaid && (
            <DropdownMenuItem
              onClick={() => handleReverseRequest(receivable)}
              className="text-destructive focus:text-destructive"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />Estornar
            </DropdownMenuItem>
          )}
          {!isPaid && (
            <DropdownMenuItem
              disabled={!isPendingOrOverdue}
              onClick={() => handleCancelRequest(receivable)}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-3.5 w-3.5" />Cancelar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhuma conta a receber</p>
    </div>
  );

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm animate-pulse space-y-3">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      ))}
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar</p>}
      {!isLoading && !isError && receivables.length === 0 && <EmptyState />}
      {receivables.map((r) => (
        <div key={r.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{r.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.categoryName} · vence {formatDate(r.dueDate)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={r.status} />
                <span className="text-sm font-semibold text-emerald-600">{formatCurrency(r.amount)}</span>
              </div>
            </div>
            <ReceivableActions receivable={r} />
          </div>
        </div>
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && <TableRow><TableCell colSpan={6}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>}
          {!isLoading && !isError && receivables.length === 0 && (
            <TableRow><TableCell colSpan={6}><EmptyState /></TableCell></TableRow>
          )}
          {receivables.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium max-w-48 truncate">{r.description}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{r.categoryName}</TableCell>
              <TableCell className="text-sm">{formatDate(r.dueDate)}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-emerald-600">{formatCurrency(r.amount)}</TableCell>
              <TableCell><StatusBadge status={r.status} /></TableCell>
              <TableCell className="text-right"><ReceivableActions receivable={r} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas a Receber</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus recebimentos</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Conta</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-0.5">
        {RECEIVABLE_STATUS_FILTERS.map((f) => {
          const isActive = statusFilter === (f.value ?? "");
          return (
            <button
              key={f.label}
              onClick={() => setStatusFilter(f.value ?? "")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                isActive ? f.activeClass : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", f.dot)} />
              </span>
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nº do Pedido</Label>
            <Input
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
              placeholder="Ex: abc123"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vencimento de</Label>
            <DatePicker value={dueDateFrom} onChange={setDueDateFrom} placeholder="De" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vencimento até</Label>
            <DatePicker value={dueDateTo} onChange={setDueDateTo} placeholder="Até" />
          </div>
        </div>
      </div>

      {mobileView}
      {desktopView}

      <CreateReceivableDialog open={createOpen} onOpenChange={setCreateOpen} />
      <PayReceivableDialog receivable={payingReceivable} open={payOpen} onOpenChange={setPayOpen} />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar conta a receber</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar <strong>{cancellingReceivable?.description}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm} disabled={cancelMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={reverseOpen} onOpenChange={setReverseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estornar conta a receber</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja estornar <strong>{reversingReceivable?.description}</strong>? Esta ação marcará o recebimento como cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reverseMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReverseConfirm} disabled={reverseMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar estorno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

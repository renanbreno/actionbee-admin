"use client";

import { useState } from "react";
import { useAccountPayables, useCancelPayable } from "../hooks/use-account-payables";
import { CreatePayableDialog } from "./create-payable-dialog";
import { PayPayableDialog } from "./pay-payable-dialog";
import type { AccountPayable } from "../../domain/entities/payable";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreHorizontal, CheckCircle, XCircle, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function AccountPayablesList() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: payables = [], isLoading, isError } = useAccountPayables(statusFilter ? { status: statusFilter } : undefined);
  const cancelMutation = useCancelPayable();

  const [createOpen, setCreateOpen] = useState(false);
  const [payingPayable, setPayingPayable] = useState<AccountPayable | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [cancellingPayable, setCancellingPayable] = useState<AccountPayable | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const handlePay = (p: AccountPayable) => { setPayingPayable(p); setPayOpen(true); };
  const handleCancelRequest = (p: AccountPayable) => { setCancellingPayable(p); setCancelOpen(true); };
  const handleCancelConfirm = () => {
    if (!cancellingPayable) return;
    cancelMutation.mutate(cancellingPayable.id, {
      onSuccess: () => { setCancelOpen(false); setCancellingPayable(null); },
    });
  };

  function PayableActions({ payable }: { payable: AccountPayable }) {
    const canPay = payable.status === "PENDING" || payable.status === "OVERDUE";
    const canCancel = payable.status === "PENDING" || payable.status === "OVERDUE";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {canPay && (
            <DropdownMenuItem onClick={() => handlePay(payable)}>
              <CheckCircle className="mr-2 h-3.5 w-3.5 text-emerald-600" />Registrar pagamento
            </DropdownMenuItem>
          )}
          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCancelRequest(payable)} className="text-destructive focus:text-destructive">
                <XCircle className="mr-2 h-3.5 w-3.5" />Cancelar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TrendingDown className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhuma conta a pagar</p>
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
      {!isLoading && !isError && payables.length === 0 && <EmptyState />}
      {payables.map((p) => (
        <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.categoryName}{p.supplier ? ` · ${p.supplier}` : ""} · vence {formatDate(p.dueDate)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={p.status} />
                <span className="text-sm font-semibold text-red-600">{formatCurrency(p.amount)}</span>
              </div>
            </div>
            <PayableActions payable={p} />
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
            <TableHead>Fornecedor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 7 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && <TableRow><TableCell colSpan={7}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>}
          {!isLoading && !isError && payables.length === 0 && (
            <TableRow><TableCell colSpan={7}><EmptyState /></TableCell></TableRow>
          )}
          {payables.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium max-w-40 truncate">{p.description}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.categoryName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.supplier ?? "—"}</TableCell>
              <TableCell className="text-sm">{formatDate(p.dueDate)}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-red-600">{formatCurrency(p.amount)}</TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
              <TableCell className="text-right"><PayableActions payable={p} /></TableCell>
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
          <h1 className="text-2xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus pagamentos</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Conta</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Select value={statusFilter || "_none"} onValueChange={(v) => setStatusFilter(v === "_none" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">Todos</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="OVERDUE">Vencido</SelectItem>
            <SelectItem value="PAID">Pago</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mobileView}
      {desktopView}

      <CreatePayableDialog open={createOpen} onOpenChange={setCreateOpen} />
      <PayPayableDialog payable={payingPayable} open={payOpen} onOpenChange={setPayOpen} />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar conta a pagar</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar <strong>{cancellingPayable?.description}</strong>?
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
    </>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAccountPayables } from "../hooks/use-account-payables";
import { CreatePayableDialog } from "./create-payable-dialog";
import { BatchPayPayableDialog } from "./batch-pay-payable-dialog";
import { SupplierSearch } from "./supplier-search";
import type { AccountPayable } from "../../domain/entities/payable";
import type { Supplier } from "../../domain/entities/supplier";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, ChevronRight, CheckCircle, TrendingDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PAYABLE_STATUS_FILTERS = [
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

export function AccountPayablesList() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dueDateFrom, setDueDateFrom] = useState<string>("");
  const [dueDateTo, setDueDateTo] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState<Supplier | null>(null);
  const [descriptionFilter, setDescriptionFilter] = useState<string>("");
  const [debouncedDescription, setDebouncedDescription] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDescription(descriptionFilter), 400);
    return () => clearTimeout(timer);
  }, [descriptionFilter]);

  const filters = {
    ...(statusFilter && { status: statusFilter }),
    ...(dueDateFrom && { dueDateFrom }),
    ...(dueDateTo && { dueDateTo }),
    ...(supplierFilter && { supplierId: supplierFilter.id }),
    ...(debouncedDescription && { description: debouncedDescription }),
  };
  const { data: payables = [], isLoading, isError } = useAccountPayables(Object.keys(filters).length ? filters : undefined);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchPayOpen, setBatchPayOpen] = useState(false);

  const eligiblePayables = useMemo(
    () => payables.filter((p) => p.status === "PENDING" || p.status === "OVERDUE"),
    [payables]
  );
  const selectedPayables = useMemo(
    () => payables.filter((p) => selectedIds.has(p.id)),
    [payables, selectedIds]
  );
  const allEligibleSelected = eligiblePayables.length > 0 && eligiblePayables.every((p) => selectedIds.has(p.id));
  const someSelected = selectedIds.size > 0 && !allEligibleSelected;
  const selectedTotal = selectedPayables.reduce((sum, p) => sum + p.amount, 0);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (allEligibleSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(eligiblePayables.map((p) => p.id)));
    }
  };

  useEffect(() => {
    setSelectedIds(new Set());
  }, [statusFilter, dueDateFrom, dueDateTo, supplierFilter, descriptionFilter]);

  const [createOpen, setCreateOpen] = useState(false);

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
      {payables.map((p) => {
        const isEligible = p.status === "PENDING" || p.status === "OVERDUE";
        return (
        <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm cursor-pointer active:bg-muted/50 transition-colors" onClick={() => router.push(`/dashboard/financial/accounts-payable/${p.id}`)}>
          <div className="flex items-start justify-between gap-2">
            {isEligible && (
              <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.categoryName}{p.supplierName ? ` · ${p.supplierName}` : ""} · vence {formatDate(p.dueDate)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={p.status} />
                <span className="text-sm font-semibold text-red-600">{formatCurrency(p.amount)}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          </div>
        </div>
        );
      })}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allEligibleSelected}
                {...(someSelected ? { "data-state": "indeterminate" } : {})}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 8 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && <TableRow><TableCell colSpan={8}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>}
          {!isLoading && !isError && payables.length === 0 && (
            <TableRow><TableCell colSpan={8}><EmptyState /></TableCell></TableRow>
          )}
          {payables.map((p) => {
            const isEligible = p.status === "PENDING" || p.status === "OVERDUE";
            return (
            <TableRow key={p.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/financial/accounts-payable/${p.id}`)}>
              <TableCell onClick={(e) => e.stopPropagation()}>
                {isEligible && <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />}
              </TableCell>
              <TableCell className="font-medium max-w-40 truncate">{p.description}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.categoryName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.supplierName ?? "—"}</TableCell>
              <TableCell className="text-sm">{formatDate(p.dueDate)}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-red-600">{formatCurrency(p.amount)}</TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
              <TableCell className="w-8">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
            );
          })}
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

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-0.5">
        {PAYABLE_STATUS_FILTERS.map((f) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Descrição</Label>
            <Input
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
              placeholder="Buscar por descrição..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fornecedor</Label>
            <SupplierSearch
              selected={supplierFilter}
              onSelect={setSupplierFilter}
              onClear={() => setSupplierFilter(null)}
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

      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg">
          <span className="text-sm font-medium whitespace-nowrap">
            {selectedIds.size} selecionada{selectedIds.size !== 1 ? "s" : ""}
          </span>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {formatCurrency(selectedTotal)}
          </span>
          <Button size="sm" onClick={() => setBatchPayOpen(true)} className="gap-1.5 whitespace-nowrap">
            <CheckCircle className="h-3.5 w-3.5" />
            Baixar em Lote
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar seleção</span>
          </Button>
        </div>
      )}

      <CreatePayableDialog open={createOpen} onOpenChange={setCreateOpen} />
      <BatchPayPayableDialog
        payables={selectedPayables}
        open={batchPayOpen}
        onOpenChange={setBatchPayOpen}
        onSuccess={() => setSelectedIds(new Set())}
      />
    </>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccountReceivables } from "../hooks/use-account-receivables";
import { CreateReceivableDialog } from "./create-receivable-dialog";
import { BatchPayReceivableDialog } from "./batch-pay-receivable-dialog";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { FINANCIAL_STATUS_LABELS } from "../../domain/enums";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, TrendingUp, ChevronRight, Banknote, QrCode, CreditCard, Barcode, CheckCircle, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const RECEIVABLE_STATUS_FILTERS = [
  { value: undefined, label: "Todos", dot: "bg-zinc-400", activeClass: "border-zinc-300 bg-zinc-100 text-zinc-700" },
  { value: "PENDING", label: "Pendente", dot: "bg-amber-500", activeClass: "border-amber-500/30 bg-amber-500/10 text-amber-700" },
  { value: "PAID", label: "Pago", dot: "bg-emerald-500", activeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" },
  { value: "PARTIALLY_PAID", label: "Pago Parcial.", dot: "bg-blue-500", activeClass: "border-blue-500/30 bg-blue-500/10 text-blue-700" },
  { value: "OVERDUE", label: "Vencido", dot: "bg-red-500", activeClass: "border-red-500/30 bg-red-500/10 text-red-700" },
  { value: "CANCELLED", label: "Cancelado", dot: "bg-muted-foreground/40", activeClass: "border-zinc-200 bg-zinc-50 text-zinc-500" },
];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BOLETO: "Boleto",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  CASH: "Dinheiro",
};

const PAYMENT_METHOD_ICONS: Record<string, LucideIcon> = {
  CASH: Banknote,
  PIX: QrCode,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  BOLETO: Barcode,
};

function splitMethods(methods: (string | null)[]): string[] {
  return [...new Set(
    methods
      .filter(Boolean)
      .flatMap((m) => m!.split(",").map((s) => s.trim()))
      .filter(Boolean)
  )];
}

function PaymentMethodIcons({ methods }: { methods: (string | null)[] }) {
  const unique = splitMethods(methods);
  if (unique.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="flex items-center gap-1.5">
      {unique.map((m) => {
        const Icon = PAYMENT_METHOD_ICONS[m!];
        const label = PAYMENT_METHOD_LABELS[m!] ?? m;
        if (!Icon) return <span key={m} className="text-xs text-muted-foreground">{label}</span>;
        return (
          <span key={m} title={label}>
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          </span>
        );
      })}
    </span>
  );
}

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
    PARTIALLY_PAID: "border-blue-500/30 bg-blue-500/10 text-blue-600",
  };
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", colors[status] ?? "")}>
      {FINANCIAL_STATUS_LABELS[status as keyof typeof FINANCIAL_STATUS_LABELS] ?? status}
    </Badge>
  );
}

function effectiveStatus(entry: AccountReceivable): string {
  if (entry.status === "PAID" && entry.paidAmount != null && entry.paidAmount < entry.amount) {
    return "PARTIALLY_PAID";
  }
  return entry.status;
}

function aggregateStatus(entries: AccountReceivable[]): string {
  const statuses = entries.map((e) => effectiveStatus(e));
  if (statuses.every((s) => s === "CANCELLED")) return "CANCELLED";
  if (statuses.every((s) => s === "PAID" || s === "CANCELLED")) return "PAID";
  if (statuses.every((s) => s === "PAID" || s === "PARTIALLY_PAID" || s === "CANCELLED") && statuses.some((s) => s === "PARTIALLY_PAID")) return "PARTIALLY_PAID";
  if (statuses.some((s) => s === "OVERDUE")) return "OVERDUE";
  if (statuses.some((s) => s === "PARTIALLY_PAID")) return "PARTIALLY_PAID";
  return "PENDING";
}

type ReceivableRow =
  | { type: "single"; entry: AccountReceivable }
  | { type: "group"; orderId: string; description: string; entries: AccountReceivable[] };

export function AccountReceivablesList() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dueDateFrom, setDueDateFrom] = useState<string>("");
  const [dueDateTo, setDueDateTo] = useState<string>("");
  const [descriptionFilter, setDescriptionFilter] = useState<string>("");
  const [customerNameFilter, setCustomerNameFilter] = useState<string>("");
  const [debouncedDescription, setDebouncedDescription] = useState<string>("");
  const [debouncedCustomerName, setDebouncedCustomerName] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDescription(descriptionFilter), 400);
    return () => clearTimeout(timer);
  }, [descriptionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCustomerName(customerNameFilter), 400);
    return () => clearTimeout(timer);
  }, [customerNameFilter]);

  const filters = {
    ...(statusFilter && { status: statusFilter }),
    ...(dueDateFrom && { dueDateFrom }),
    ...(dueDateTo && { dueDateTo }),
    ...(debouncedDescription && { description: debouncedDescription }),
    ...(debouncedCustomerName && { customerName: debouncedCustomerName }),
  };
  const { data: receivables = [], isLoading, isError } = useAccountReceivables(Object.keys(filters).length ? filters : undefined);

  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchPayOpen, setBatchPayOpen] = useState(false);

  const allReceivables = receivables;
  const eligibleReceivables = useMemo(
    () => allReceivables.filter((r) => r.status === "PENDING" || r.status === "OVERDUE"),
    [allReceivables]
  );
  const selectedReceivables = useMemo(
    () => allReceivables.filter((r) => selectedIds.has(r.id)),
    [allReceivables, selectedIds]
  );
  const allEligibleSelected = eligibleReceivables.length > 0 && eligibleReceivables.every((r) => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0 && !allEligibleSelected;
  const selectedTotal = selectedReceivables.reduce((sum, r) => sum + r.amount, 0);

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
      setSelectedIds(new Set(eligibleReceivables.map((r) => r.id)));
    }
  };

  useEffect(() => {
    setSelectedIds(new Set());
  }, [statusFilter, dueDateFrom, dueDateTo, descriptionFilter, customerNameFilter]);

  const rows = useMemo((): ReceivableRow[] => {
    const orderMap = new Map<string, AccountReceivable[]>();
    const standalone: AccountReceivable[] = [];

    for (const r of receivables) {
      if (r.orderId) {
        const existing = orderMap.get(r.orderId) ?? [];
        orderMap.set(r.orderId, [...existing, r]);
      } else {
        standalone.push(r);
      }
    }

    const result: ReceivableRow[] = [];

    for (const [orderId, entries] of orderMap.entries()) {
      if (entries.length === 1) {
        result.push({ type: "single", entry: entries[0] });
      } else {
        result.push({ type: "group", orderId, description: entries[0].description, entries });
      }
    }

    for (const entry of standalone) {
      result.push({ type: "single", entry });
    }

    return result.sort((a, b) => {
      const dateA = a.type === "single" ? a.entry.dueDate : a.entries[0].dueDate;
      const dateB = b.type === "single" ? b.entry.dueDate : b.entries[0].dueDate;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  }, [receivables]);

  function navigateToDetail(entryId: string) {
    router.push(`/dashboard/financial/accounts-receivable/${entryId}`);
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhuma conta a receber</p>
    </div>
  );

  // ── Mobile ──────────────────────────────────────────────────────────────────

  function GroupCardMobile({ row }: { row: Extract<ReceivableRow, { type: "group" }> }) {
    const total = row.entries.reduce((s, e) => s + e.amount, 0);
    const paid = row.entries.reduce((s, e) => s + (e.status === "PAID" ? (e.paidAmount ?? e.amount) : 0), 0);
    const status = aggregateStatus(row.entries);
    const groupEligible = row.entries.some((e) => e.status === "PENDING" || e.status === "OVERDUE");
    const customerName = row.entries[0].customerName;
    return (
      <div
        className="w-full text-left rounded-xl border bg-card p-4 shadow-sm cursor-pointer active:bg-muted/50 transition-colors"
        onClick={() => navigateToDetail(row.entries[0].id)}
      >
        <div className="flex items-start justify-between gap-2">
          {groupEligible && (
            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={row.entries.filter((e) => e.status === "PENDING" || e.status === "OVERDUE").every((e) => selectedIds.has(e.id))}
                onCheckedChange={() => {
                  const eligible = row.entries.filter((e) => e.status === "PENDING" || e.status === "OVERDUE");
                  const allSelected = eligible.every((e) => selectedIds.has(e.id));
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    eligible.forEach((e) => allSelected ? next.delete(e.id) : next.add(e.id));
                    return next;
                  });
                }}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="truncate text-sm font-semibold">{row.description}</p>
            </div>
            {customerName && (
              <p className="text-xs text-muted-foreground mt-0.5">{customerName}</p>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <PaymentMethodIcons methods={row.entries.map((e) => e.paymentMethod)} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-sm font-semibold text-emerald-600">{formatCurrency(total)}</span>
              {paid > 0 && paid < total && (
                <span className="text-xs text-muted-foreground">{formatCurrency(paid)} recebido</span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </div>
    );
  }

  function SingleCardMobile({ entry }: { entry: AccountReceivable }) {
    const status = effectiveStatus(entry);
    const isEligible = entry.status === "PENDING" || entry.status === "OVERDUE";
    return (
      <div
        className="w-full text-left rounded-xl border bg-card p-4 shadow-sm cursor-pointer active:bg-muted/50 transition-colors"
        onClick={() => navigateToDetail(entry.id)}
      >
        <div className="flex items-start justify-between gap-2">
          {isEligible && (
            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={selectedIds.has(entry.id)} onCheckedChange={() => toggleSelect(entry.id)} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{entry.description}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <PaymentMethodIcons methods={[entry.paymentMethod]} />
              <span className="text-xs text-muted-foreground">
                {entry.categoryName}{entry.customerName ? ` · ${entry.customerName}` : ""} · vence {formatDate(entry.dueDate)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-sm font-semibold text-emerald-600">{formatCurrency(entry.amount)}</span>
              {status === "PARTIALLY_PAID" && (
                <span className="text-xs text-muted-foreground">{formatCurrency(entry.paidAmount!)} recebido</span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </div>
    );
  }

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm animate-pulse space-y-3">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      ))}
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar</p>}
      {!isLoading && !isError && rows.length === 0 && <EmptyState />}
      {rows.map((row) =>
        row.type === "group"
          ? <GroupCardMobile key={row.orderId} row={row} />
          : <SingleCardMobile key={row.entry.id} entry={row.entry} />
      )}
    </div>
  );

  // ── Desktop ──────────────────────────────────────────────────────────────────

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
            <TableHead>Cliente</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 9 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && (
            <TableRow><TableCell colSpan={9}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>
          )}
          {!isLoading && !isError && rows.length === 0 && (
            <TableRow><TableCell colSpan={9}><EmptyState /></TableCell></TableRow>
          )}
          {rows.map((row) => {
            if (row.type === "group") {
              const total = row.entries.reduce((s, e) => s + e.amount, 0);
              const paid = row.entries.reduce((s, e) => s + (e.status === "PAID" ? (e.paidAmount ?? e.amount) : 0), 0);
              const status = aggregateStatus(row.entries);
              const earliestDue = row.entries.reduce(
                (min, e) => new Date(e.dueDate) < new Date(min) ? e.dueDate : min,
                row.entries[0].dueDate,
              );
              const groupEligible = row.entries.filter((e) => e.status === "PENDING" || e.status === "OVERDUE");
              const groupAllSelected = groupEligible.length > 0 && groupEligible.every((e) => selectedIds.has(e.id));
              return (
                <TableRow
                  key={row.orderId}
                  className="cursor-pointer"
                  onClick={() => navigateToDetail(row.entries[0].id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {groupEligible.length > 0 && (
                      <Checkbox
                        checked={groupAllSelected}
                        onCheckedChange={() => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            groupEligible.forEach((e) => groupAllSelected ? next.delete(e.id) : next.add(e.id));
                            return next;
                          });
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-48">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{row.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.entries[0].customerName ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.entries[0].categoryName}</TableCell>
                  <TableCell><PaymentMethodIcons methods={row.entries.map((e) => e.paymentMethod)} /></TableCell>
                  <TableCell className="text-sm">{formatDate(earliestDue)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-emerald-600">{formatCurrency(total)}</span>
                      {paid > 0 && paid < total && (
                        <span className="text-xs text-muted-foreground">{formatCurrency(paid)} recebido</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={status} /></TableCell>
                  <TableCell className="w-8">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              );
            }

            const entry = row.entry;
            const status = effectiveStatus(entry);
            const isEligible = entry.status === "PENDING" || entry.status === "OVERDUE";

            return (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => navigateToDetail(entry.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isEligible && <Checkbox checked={selectedIds.has(entry.id)} onCheckedChange={() => toggleSelect(entry.id)} />}
                </TableCell>
                <TableCell className="font-medium max-w-48 truncate">{entry.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.customerName ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.categoryName}</TableCell>
                <TableCell><PaymentMethodIcons methods={[entry.paymentMethod]} /></TableCell>
                <TableCell className={cn("text-sm", entry.status === "OVERDUE" && "text-red-600 font-medium")}>
                  {formatDate(entry.dueDate)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-emerald-600">{formatCurrency(entry.amount)}</span>
                    {status === "PARTIALLY_PAID" && (
                      <span className="text-xs text-muted-foreground">{formatCurrency(entry.paidAmount!)} recebido</span>
                    )}
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={status} /></TableCell>
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
            <Label className="text-sm font-medium">Cliente</Label>
            <Input
              value={customerNameFilter}
              onChange={(e) => setCustomerNameFilter(e.target.value)}
              placeholder="Buscar por nome..."
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

      <CreateReceivableDialog open={createOpen} onOpenChange={setCreateOpen} />
      <BatchPayReceivableDialog
        receivables={selectedReceivables}
        open={batchPayOpen}
        onOpenChange={setBatchPayOpen}
        onSuccess={() => setSelectedIds(new Set())}
      />
    </>
  );
}

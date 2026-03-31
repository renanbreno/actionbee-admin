"use client";

import { useState } from "react";
import { useFinancialTransactions } from "../hooks/use-financial-transactions";
import { CreateTransactionDialog } from "./create-transaction-dialog";
import { CreateTransferDialog } from "./create-transfer-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, ArrowLeftRight, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    INCOME: { label: "Receita", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" },
    EXPENSE: { label: "Despesa", className: "border-red-500/30 bg-red-500/10 text-red-600" },
    TRANSFER: { label: "Transferência", className: "border-blue-500/30 bg-blue-500/10 text-blue-600" },
  };
  const { label, className } = config[type] ?? { label: type, className: "" };
  return <Badge variant="outline" className={cn("text-xs font-medium", className)}>{label}</Badge>;
}

export function FinancialTransactionsList() {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const { data: transactions = [], isLoading, isError } = useFinancialTransactions(typeFilter ? { type: typeFilter } : undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Receipt className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhum lançamento encontrado</p>
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
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar lançamentos</p>}
      {!isLoading && !isError && transactions.length === 0 && <EmptyState />}
      {transactions.map((t) => (
        <div key={t.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{t.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.accountName} · {formatDate(t.date)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <TypeBadge type={t.type} />
                <span className={cn("text-sm font-semibold",
                  t.type === "INCOME" ? "text-emerald-600" : t.type === "EXPENSE" ? "text-red-600" : "text-blue-600"
                )}>
                  {t.type === "EXPENSE" ? "−" : "+"}{formatCurrency(t.amount)}
                </span>
              </div>
            </div>
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
            <TableHead>Tipo</TableHead>
            <TableHead>Conta</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 5 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && <TableRow><TableCell colSpan={5}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>}
          {!isLoading && !isError && transactions.length === 0 && (
            <TableRow><TableCell colSpan={5}><EmptyState /></TableCell></TableRow>
          )}
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium max-w-48 truncate">{t.description}</TableCell>
              <TableCell><TypeBadge type={t.type} /></TableCell>
              <TableCell className="text-sm text-muted-foreground">{t.accountName}</TableCell>
              <TableCell className="text-sm">{formatDate(t.date)}</TableCell>
              <TableCell className={cn("text-right text-sm font-semibold",
                t.type === "INCOME" ? "text-emerald-600" : t.type === "EXPENSE" ? "text-red-600" : "text-blue-600"
              )}>
                {t.type === "EXPENSE" ? "−" : "+"}{formatCurrency(t.amount)}
              </TableCell>
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
          <h1 className="text-2xl font-bold tracking-tight">Lançamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">Histórico de movimentações financeiras</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setCreateOpen(true)}>
              <Receipt className="mr-2 h-3.5 w-3.5" />Lançamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTransferOpen(true)}>
              <ArrowLeftRight className="mr-2 h-3.5 w-3.5" />Transferência
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Select value={typeFilter || "_none"} onValueChange={(v) => setTypeFilter(v === "_none" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">Todos</SelectItem>
            <SelectItem value="INCOME">Receitas</SelectItem>
            <SelectItem value="EXPENSE">Despesas</SelectItem>
            <SelectItem value="TRANSFER">Transferências</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mobileView}
      {desktopView}

      <CreateTransactionDialog open={createOpen} onOpenChange={setCreateOpen} />
      <CreateTransferDialog open={transferOpen} onOpenChange={setTransferOpen} />
    </>
  );
}

"use client";

import { useState } from "react";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { CreateAccountDialog } from "./create-account-dialog";
import { EditAccountDialog } from "./edit-account-dialog";
import type { FinancialAccount } from "../../domain/entities/account";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MoreHorizontal, Pencil, Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function AccountTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium",
      type === "BANK" ? "border-blue-500/30 bg-blue-500/10 text-blue-600" : "border-amber-500/30 bg-amber-500/10 text-amber-600"
    )}>
      {type === "BANK" ? "Banco" : "Caixa"}
    </Badge>
  );
}

export function FinancialAccountsList() {
  const { data: accounts = [], isLoading, isError } = useFinancialAccounts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (a: FinancialAccount) => { setEditingAccount(a); setEditOpen(true); };

  function AccountActions({ account }: { account: FinancialAccount }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleEdit(account)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />Editar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Landmark className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhuma conta cadastrada</p>
      <p className="mt-1 text-xs text-muted-foreground/60">Crie a primeira conta para começar</p>
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
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar contas</p>}
      {!isLoading && !isError && accounts.length === 0 && <EmptyState />}
      {accounts.map((a) => (
        <div key={a.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{a.name}</p>
              {a.bankName && <p className="text-xs text-muted-foreground mt-0.5">{a.bankName}{a.agency ? ` — Ag. ${a.agency}` : ""}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <AccountTypeBadge type={a.type} />
                <span className={cn("text-sm font-medium", a.currentBalance < 0 ? "text-red-600" : "text-emerald-600")}>
                  {formatCurrency(a.currentBalance)}
                </span>
              </div>
            </div>
            <AccountActions account={a} />
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
            <TableHead>Conta</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead className="text-right">Saldo Atual</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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
          {!isLoading && !isError && accounts.length === 0 && (
            <TableRow><TableCell colSpan={5}><EmptyState /></TableCell></TableRow>
          )}
          {accounts.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell><AccountTypeBadge type={a.type} /></TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {a.bankName ?? "—"}{a.agency ? ` / Ag. ${a.agency}` : ""}
              </TableCell>
              <TableCell className={cn("text-right text-sm font-semibold", a.currentBalance < 0 ? "text-red-600" : "text-emerald-600")}>
                {formatCurrency(a.currentBalance)}
              </TableCell>
              <TableCell className="text-right"><AccountActions account={a} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const totalBalance = accounts.filter(a => a.active).reduce((sum, a) => sum + a.currentBalance, 0);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saldo total: <span className={cn("font-semibold", totalBalance < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(totalBalance)}</span>
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Conta</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {mobileView}
      {desktopView}

      <CreateAccountDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditAccountDialog account={editingAccount} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}

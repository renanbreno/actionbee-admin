"use client";

import { useState } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useSuppliers, useDeleteSupplier, useUpdateSupplier } from "../hooks/use-suppliers";
import { CreateSupplierDialog } from "./create-supplier-dialog";
import { EditSupplierDialog } from "./edit-supplier-dialog";
import type { Supplier } from "../../domain/entities/supplier";
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
import { Plus, MoreHorizontal, Pencil, Trash2, Building2, ToggleLeft, ToggleRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCNPJ } from "@/shared/utils/masks";

const ACTIVE_FILTERS = [
  { value: undefined, label: "Todos", activeClass: "border-zinc-300 bg-zinc-100 text-zinc-700" },
  { value: true, label: "Ativos", activeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" },
  { value: false, label: "Inativos", activeClass: "border-zinc-200 bg-zinc-50 text-zinc-500" },
] as const;

export function SuppliersList() {
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const filters = {
    ...(activeFilter !== undefined && { active: activeFilter }),
    ...(debouncedSearch.length >= 2 && { search: debouncedSearch }),
  };
  const { data: suppliers = [], isLoading, isError } = useSuppliers(Object.keys(filters).length ? filters : undefined);
  const deleteMutation = useDeleteSupplier();
  const updateMutation = useUpdateSupplier();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (s: Supplier) => { setEditingSupplier(s); setEditOpen(true); };
  const handleDeleteRequest = (s: Supplier) => { setDeletingSupplier(s); setDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!deletingSupplier) return;
    deleteMutation.mutate(deletingSupplier.id, {
      onSuccess: () => { setDeleteOpen(false); setDeletingSupplier(null); },
    });
  };
  const handleToggleActive = (s: Supplier) => {
    updateMutation.mutate({ id: s.id, data: { active: !s.active } });
  };

  function SupplierActions({ supplier }: { supplier: Supplier }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => handleEdit(supplier)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleToggleActive(supplier)}>
            {supplier.active
              ? <><ToggleLeft className="mr-2 h-3.5 w-3.5" />Desativar</>
              : <><ToggleRight className="mr-2 h-3.5 w-3.5" />Ativar</>}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDeleteRequest(supplier)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5" />Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Building2 className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhum fornecedor encontrado</p>
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
      {!isLoading && !isError && suppliers.length === 0 && <EmptyState />}
      {suppliers.map((s) => (
        <div key={s.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{s.razaoSocial}</p>
              {s.nomeFantasia && <p className="text-xs text-muted-foreground">{s.nomeFantasia}</p>}
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {s.cnpj && <span className="text-xs text-muted-foreground">{formatCNPJ(s.cnpj)}</span>}
                <Badge variant="outline" className={cn("text-xs", s.active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-zinc-400/30 bg-zinc-400/10 text-zinc-500")}>
                  {s.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              {s.city && s.state && (
                <p className="text-xs text-muted-foreground mt-1">{s.city}/{s.state}</p>
              )}
            </div>
            <SupplierActions supplier={s} />
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
            <TableHead>Razão Social</TableHead>
            <TableHead>Nome Fantasia</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Cidade/UF</TableHead>
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
          {!isLoading && !isError && suppliers.length === 0 && (
            <TableRow><TableCell colSpan={6}><EmptyState /></TableCell></TableRow>
          )}
          {suppliers.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium max-w-44 truncate">{s.razaoSocial}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-36 truncate">{s.nomeFantasia ?? "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{s.cnpj ? formatCNPJ(s.cnpj) : "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{s.city && s.state ? `${s.city}/${s.state}` : "—"}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("text-xs", s.active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-zinc-400/30 bg-zinc-400/10 text-zinc-500")}>
                  {s.active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right"><SupplierActions supplier={s} /></TableCell>
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
          <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus fornecedores</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Fornecedor</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-0.5">
        {ACTIVE_FILTERS.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                isActive ? f.activeClass : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por razão social ou nome fantasia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {mobileView}
      {desktopView}

      <CreateSupplierDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditSupplierDialog supplier={editingSupplier} open={editOpen} onOpenChange={setEditOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir fornecedor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deletingSupplier?.razaoSocial}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { useFinancialCategories, useDeleteFinancialCategory } from "../hooks/use-financial-categories";
import { CreateCategoryDialog } from "./create-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import type { FinancialCategory } from "../../domain/entities/category";
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
import { Plus, MoreHorizontal, Pencil, Trash2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium",
      type === "INCOME"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
        : "border-red-500/30 bg-red-500/10 text-red-600"
    )}>
      {type === "INCOME" ? "Receita" : "Despesa"}
    </Badge>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium",
      active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-zinc-400/30 bg-zinc-400/10 text-zinc-500"
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-zinc-400")} />
      {active ? "Ativa" : "Inativa"}
    </Badge>
  );
}

export function FinancialCategoriesList() {
  const { data: categories = [], isLoading, isError } = useFinancialCategories();
  const deleteMutation = useDeleteFinancialCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FinancialCategory | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<FinancialCategory | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (c: FinancialCategory) => { setEditingCategory(c); setEditOpen(true); };
  const handleDeleteRequest = (c: FinancialCategory) => { setDeletingCategory(c); setDeleteOpen(true); };
  const handleDeleteConfirm = () => {
    if (!deletingCategory) return;
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => { setDeleteOpen(false); setDeletingCategory(null); },
    });
  };

  function CategoryActions({ category }: { category: FinancialCategory }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleEdit(category)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDeleteRequest(category)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5" />Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Tag className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhuma categoria cadastrada</p>
      <p className="mt-1 text-xs text-muted-foreground/60">Crie a primeira categoria para começar</p>
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
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar categorias</p>}
      {!isLoading && !isError && categories.length === 0 && <EmptyState />}
      {categories.map((c) => (
        <div key={c.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {c.color && <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />}
                <p className="truncate text-sm font-semibold">{c.name}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <TypeBadge type={c.type} />
                <ActiveBadge active={c.active} />
              </div>
            </div>
            <CategoryActions category={c} />
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
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 4 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && <TableRow><TableCell colSpan={4}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>}
          {!isLoading && !isError && categories.length === 0 && (
            <TableRow><TableCell colSpan={4}><EmptyState /></TableCell></TableRow>
          )}
          {categories.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {c.color && <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />}
                  <span className="text-sm font-medium">{c.name}</span>
                </div>
              </TableCell>
              <TableCell><TypeBadge type={c.type} /></TableCell>
              <TableCell><ActiveBadge active={c.active} /></TableCell>
              <TableCell className="text-right"><CategoryActions category={c} /></TableCell>
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
          <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-1">Categorias de receita e despesa</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Categoria</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {mobileView}
      {desktopView}

      <CreateCategoryDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditCategoryDialog category={editingCategory} open={editOpen} onOpenChange={setEditOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deletingCategory?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

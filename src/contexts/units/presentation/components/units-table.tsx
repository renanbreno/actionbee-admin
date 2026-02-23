"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Box,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Unit } from "../../domain/entities/unit";
import { useUnits, useDeleteUnit } from "../hooks";
import { EditUnitDialog } from "./edit-unit-dialog";
import { cn } from "@/lib/utils";

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 text-xs font-medium",
        isActive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          : "border-zinc-400/30 bg-zinc-400/10 text-zinc-500"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-zinc-400"
        )}
      />
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
}

interface UnitActionsProps {
  unit: Unit;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

function UnitActions({ unit, onEdit, onDelete }: UnitActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onEdit(unit)}>
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(unit)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
        <div className="h-6 w-14 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 px-4">
      <Box className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium text-center">Nenhuma unidade cadastrada</p>
      <p className="text-muted-foreground text-sm text-center max-w-xs">
        Crie sua primeira unidade de medida clicando no botão acima.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <p className="text-destructive font-medium">Erro ao carregar unidades</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

function UnitCard({
  unit,
  onEdit,
  onDelete,
}: {
  unit: Unit;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bee-gold/10">
          <span className="text-sm font-bold text-bee-gold">
            {unit.acronym}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {unit.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Sigla: {unit.acronym}
              </p>
            </div>
            <UnitActions unit={unit} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="mt-2">
            <StatusBadge isActive={unit.isActive} />
          </div>
        </div>
      </div>
    </div>
  );
}

function UnitRow({
  unit,
  onEdit,
  onDelete,
}: {
  unit: Unit;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bee-gold/10">
            <span className="text-xs font-bold text-bee-gold">
              {unit.acronym}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{unit.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {unit.acronym}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge isActive={unit.isActive} />
      </TableCell>
      <TableCell className="text-right">
        <UnitActions unit={unit} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

export function UnitsTable() {
  const { data: units = [], isLoading, isError } = useUnits();
  const deleteMutation = useDeleteUnit();

  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setEditOpen(true);
  };

  const handleDeleteRequest = (unit: Unit) => {
    setDeletingUnit(unit);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingUnit) return;
    deleteMutation.mutate(deletingUnit.id, {
      onSuccess: () => {
        toast.success("Unidade excluída com sucesso!");
        setDeleteOpen(false);
        setDeletingUnit(null);
      },
      onError: (e) => {
        if (e.message?.includes("está sendo usada") || e.message?.includes("variantes")) {
          toast.error("Esta unidade está sendo usada em produtos. Inative-a em vez de excluí-la.");
        } else {
          toast.error(e.message ?? "Erro ao excluir unidade");
        }
      },
    });
  };

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && units.length === 0 && <EmptyState />}
      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidade</TableHead>
            <TableHead>Sigla</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 4 }).map((__, j) => (
                  <TableCell key={j}>
                    <div className="h-4 rounded bg-muted animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {isError && (
            <TableRow>
              <TableCell colSpan={4}>
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && units.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {units.map((unit) => (
            <UnitRow
              key={unit.id}
              unit={unit}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}

      <EditUnitDialog
        unit={editingUnit}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir unidade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a unidade{" "}
              <strong>{deletingUnit?.name}</strong> ({deletingUnit?.acronym})? Esta
              ação não pode ser desfeita.{" "}
              <span className="text-amber-600 dark:text-amber-400">
                Se a unidade estiver sendo usada em produtos, a exclusão não será
                permitida. Nesse caso, recomendamos inativá-la.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

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
  Gift,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ImageOff,
} from "lucide-react";
import { GiftTier } from "../../domain/entities/gift-tier";
import { useGiftTiers } from "../hooks/use-gift-tiers";
import { useActivateGiftTier } from "../hooks/use-activate-gift-tier";
import { useDeactivateGiftTier } from "../hooks/use-deactivate-gift-tier";
import { useDeleteGiftTier } from "../hooks/use-delete-gift-tier";
import { EditGiftTierDialog } from "./edit-gift-tier-dialog";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function GiftImage({ imageUrl, name }: { imageUrl?: string; name: string }) {
  if (!imageUrl) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={name}
      className="h-10 w-10 shrink-0 rounded-md object-cover"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

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

interface GiftTierActionsProps {
  giftTier: GiftTier;
  onEdit: (gt: GiftTier) => void;
  onDelete: (gt: GiftTier) => void;
}

function GiftTierActions({ giftTier, onEdit, onDelete }: GiftTierActionsProps) {
  const activateMutation = useActivateGiftTier();
  const deactivateMutation = useDeactivateGiftTier();
  const isPending = activateMutation.isPending || deactivateMutation.isPending;

  const handleToggle = () => {
    if (giftTier.isActive) {
      deactivateMutation.mutate(giftTier.id, {
        onSuccess: () => toast.success("Brinde desativado"),
        onError: (e) => toast.error(e.message ?? "Erro ao desativar"),
      });
    } else {
      activateMutation.mutate(giftTier.id, {
        onSuccess: () => toast.success("Brinde ativado"),
        onError: (e) => toast.error(e.message ?? "Erro ao ativar"),
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={isPending}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onEdit(giftTier)}>
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggle} disabled={isPending}>
          {giftTier.isActive ? (
            <>
              <XCircle className="mr-2 h-3.5 w-3.5" />
              Desativar
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-3.5 w-3.5" />
              Ativar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(giftTier)}
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
        <div className="h-10 w-10 rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
        <div className="h-6 w-14 rounded-full bg-muted" />
      </div>
      <div className="h-3 w-full rounded bg-muted" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Gift className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">
        Nenhum brinde cadastrado
      </p>
      <p className="mt-1 text-xs text-muted-foreground/60">
        Crie o primeiro brinde para exibir no ecommerce
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm text-destructive">Erro ao carregar brindes</p>
    </div>
  );
}

function GiftCard({
  giftTier,
  onEdit,
  onDelete,
}: {
  giftTier: GiftTier;
  onEdit: (gt: GiftTier) => void;
  onDelete: (gt: GiftTier) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <GiftImage imageUrl={giftTier.imageUrl} name={giftTier.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {giftTier.name}
              </p>
              {giftTier.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {giftTier.description}
                </p>
              )}
            </div>
            <GiftTierActions giftTier={giftTier} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge isActive={giftTier.isActive} />
            <span className="text-xs font-medium text-bee-gold">
              A partir de {formatCurrency(giftTier.minOrderValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GiftRow({
  giftTier,
  onEdit,
  onDelete,
}: {
  giftTier: GiftTier;
  onEdit: (gt: GiftTier) => void;
  onDelete: (gt: GiftTier) => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <GiftImage imageUrl={giftTier.imageUrl} name={giftTier.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{giftTier.name}</p>
            {giftTier.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {giftTier.description}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm font-medium text-bee-gold">
        {formatCurrency(giftTier.minOrderValue)}
      </TableCell>
      <TableCell>
        <StatusBadge isActive={giftTier.isActive} />
      </TableCell>
      <TableCell className="text-right">
        <GiftTierActions giftTier={giftTier} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

export function GiftTiersTable() {
  const { data: giftTiers = [], isLoading, isError } = useGiftTiers();
  const deleteMutation = useDeleteGiftTier();

  const [editingGift, setEditingGift] = useState<GiftTier | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingGift, setDeletingGift] = useState<GiftTier | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (gt: GiftTier) => {
    setEditingGift(gt);
    setEditOpen(true);
  };

  const handleDeleteRequest = (gt: GiftTier) => {
    setDeletingGift(gt);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingGift) return;
    deleteMutation.mutate(deletingGift.id, {
      onSuccess: () => {
        toast.success("Brinde excluído com sucesso!");
        setDeleteOpen(false);
        setDeletingGift(null);
      },
      onError: (e) => {
        // Se o brinde já foi usado em compras, exibe mensagem orientando a inativação
        if (e.message?.includes("já foi utilizado") || e.message?.includes("inativá-lo")) {
          toast.error("Este brinde já foi usado em compras. Inative-o em vez de excluí-lo.");
        } else {
          toast.error(e.message ?? "Erro ao excluir brinde");
        }
      },
    });
  };

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && giftTiers.length === 0 && <EmptyState />}
      {giftTiers.map((gt) => (
        <GiftCard
          key={gt.id}
          giftTier={gt}
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
            <TableHead>Brinde</TableHead>
            <TableHead>Valor mínimo</TableHead>
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
          {!isLoading && !isError && giftTiers.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {giftTiers.map((gt) => (
            <GiftRow
              key={gt.id}
              giftTier={gt}
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

      <EditGiftTierDialog
        giftTier={editingGift}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir brinde</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o brinde{" "}
              <strong>{deletingGift?.name}</strong>? Esta ação não pode ser
              desfeita.{" "}
              <span className="text-amber-600 dark:text-amber-400">
                Se o brinde já foi usado em compras, a exclusão não será permitida. Nesse caso, recomendamos inativá-lo.
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

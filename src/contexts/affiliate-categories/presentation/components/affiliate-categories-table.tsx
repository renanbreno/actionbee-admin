"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  Edit,
  AlertTriangle,
  FolderTree,
  MoreHorizontal,
  AlignLeft,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";
import { useAffiliateCategories } from "../hooks/use-affiliate-categories";
import { useDeleteAffiliateCategory } from "../hooks/use-delete-affiliate-category";
import { useUpdateAffiliateCategory } from "../hooks/use-update-affiliate-category";
import { AffiliateCategoryFormDialog } from "./affiliate-category-form-dialog";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Status Badge ─── */
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-zinc-100 text-zinc-600 border-zinc-200"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Ativa
        </>
      ) : (
        <>
          <Ban className="h-3.5 w-3.5" />
          Inativa
        </>
      )}
    </Badge>
  );
}

/* ─── Actions Dropdown ─── */
interface CategoryActionsProps {
  category: AffiliateCategory;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isPending: boolean;
}

function CategoryActions({
  category,
  onEdit,
  onDelete,
  onToggleActive,
  isPending,
}: CategoryActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onToggleActive} disabled={isPending}>
          {category.isActive ? (
            <>
              <Ban className="mr-2 h-3.5 w-3.5" />
              Desativar
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              Ativar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Mobile Card ─── */
interface CategoryCardProps {
  category: AffiliateCategory;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isPending: boolean;
}

function CategoryCard({
  category,
  onEdit,
  onDelete,
  onToggleActive,
  isPending,
}: CategoryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bee-gold/20 text-bee-amber shrink-0">
              <FolderTree className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base truncate">{category.name}</p>
              <p className="text-muted-foreground text-xs">
                Criada em {formatDate(category.createdAt)}
              </p>
            </div>
          </div>
          <StatusBadge isActive={category.isActive} />
        </div>

        {/* Description */}
        {category.description && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlignLeft className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{category.description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <span
              className={`text-xs font-medium ${
                category.isActive ? "text-emerald-600" : "text-zinc-500"
              }`}
            >
              {category.isActive ? "Ativa" : "Inativa"}
            </span>
          </div>
          <CategoryActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
            isPending={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
interface CategoryRowProps {
  category: AffiliateCategory;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isPending: boolean;
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
  onToggleActive,
  isPending,
}: CategoryRowProps) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bee-gold/20 text-bee-amber">
            <FolderTree className="h-4.5 w-4.5" />
          </div>
          <span className="font-medium">{category.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs">
          {category.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          ) : (
            <span className="text-muted-foreground/50 text-sm">—</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge isActive={category.isActive} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(category.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <CategoryActions
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          isPending={isPending}
        />
      </TableCell>
    </TableRow>
  );
}

/* ─── Skeletons ─── */
function CardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-9 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-64" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <FolderTree className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhuma categoria cadastrada</p>
      <p className="text-muted-foreground text-sm">
        Crie sua primeira categoria clicando no botão acima.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar categorias</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function AffiliateCategoriesTable() {
  const { data: categories, isLoading, isError } = useAffiliateCategories(true);
  const deleteMutation = useDeleteAffiliateCategory();
  const updateMutation = useUpdateAffiliateCategory();
  const [editingCategory, setEditingCategory] = useState<AffiliateCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isPending = deleteMutation.isPending || updateMutation.isPending;

  const handleEdit = (category: AffiliateCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a categoria ${name}?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Categoria excluída"),
        onError: () => toast.error("Erro ao excluir categoria"),
      });
    }
  };

  const handleToggleActive = (category: AffiliateCategory) => {
    updateMutation.mutate(
      {
        id: category.id,
        data: { name: category.name, description: category.description },
      },
      {
        onSuccess: () => {
          toast.success(
            `Categoria ${category.isActive ? "desativada" : "ativada"} com sucesso!`
          );
        },
        onError: () => {
          toast.error(`Erro ao ${category.isActive ? "desativar" : "ativar"} categoria`);
        },
      }
    );
  };

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && categories?.length === 0 && <EmptyState />}
      {categories?.map((c) => (
        <CategoryCard
          key={c.id}
          category={c}
          onEdit={() => handleEdit(c)}
          onDelete={() => handleDelete(c.id, c.name)}
          onToggleActive={() => handleToggleActive(c)}
          isPending={isPending}
        />
      ))}
    </div>
  );

  /* Desktop: table */
  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[130px]">Criada em</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && categories?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {categories?.map((c) => (
            <CategoryRow
              key={c.id}
              category={c}
              onEdit={() => handleEdit(c)}
              onDelete={() => handleDelete(c.id, c.name)}
              onToggleActive={() => handleToggleActive(c)}
              isPending={isPending}
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
      <AffiliateCategoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={editingCategory}
      />
    </>
  );
}

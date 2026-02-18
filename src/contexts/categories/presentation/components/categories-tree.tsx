"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Pencil,
  Trash2,
  Star,
  FolderOpen,
  Folder,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "../../domain/entities/category";
import { useCategories } from "../hooks/use-categories";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

/* ─── Category Item (used for both parent and child) ─── */
function CategoryItem({
  category,
  isChild,
  rootCategories,
}: {
  category: Category;
  isChild?: boolean;
  rootCategories: Category[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasChildren = category.subcategories && category.subcategories.length > 0;

  const content = (
    <div
      className={cn(
        "group rounded-xl border bg-card transition-all duration-200",
        isChild ? "ml-4 sm:ml-8 border-dashed" : "shadow-sm",
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
        {/* Expand toggle */}
        {hasChildren && !isChild ? (
          <CollapsibleTrigger asChild>
            <button
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-muted transition-colors"
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-250",
                  expanded && "rotate-90",
                )}
              />
            </button>
          </CollapsibleTrigger>
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            {isChild ? (
              <div className="h-4 w-4 rounded-md bg-muted flex items-center justify-center">
                <Folder className="h-3 w-3 text-muted-foreground" />
              </div>
            ) : (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm sm:text-base truncate">
              {category.name}
            </span>
            {category.featured && (
              <Badge
                variant="outline"
                className="gap-1 bg-amber-50 text-amber-700 border-amber-200 text-[10px] sm:text-xs"
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Destaque
              </Badge>
            )}
            {!category.isActive && (
              <Badge
                variant="outline"
                className="text-muted-foreground text-[10px] sm:text-xs"
              >
                Inativa
              </Badge>
            )}
            {hasChildren && (
              <span className="text-xs text-muted-foreground">
                {category.subcategories!.length} sub
              </span>
            )}
          </div>
          {category.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              {category.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children (animated) */}
      {hasChildren && !isChild && (
        <CollapsibleContent className="overflow-hidden">
          <div className="space-y-2 px-3 sm:px-4 pb-3 sm:pb-4">
            {category.subcategories!.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                isChild
                rootCategories={rootCategories}
              />
            ))}
          </div>
        </CollapsibleContent>
      )}
    </div>
  );

  return (
    <>
      {hasChildren && !isChild ? (
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          {content}
        </Collapsible>
      ) : (
        content
      )}

      <EditCategoryDialog
        category={category}
        open={editOpen}
        onOpenChange={setEditOpen}
        parentCategories={rootCategories}
      />
      <DeleteCategoryDialog
        category={category}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

/* ─── Skeletons ─── */
function TreeSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
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
export function CategoriesTree() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) return <TreeSkeleton />;
  if (isError) return <ErrorState />;
  if (!categories || categories.length === 0) return <EmptyState />;

  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-3">
      {rootCategories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          rootCategories={rootCategories}
        />
      ))}
    </div>
  );
}

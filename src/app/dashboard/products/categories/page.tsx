"use client";

import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesTree } from "@/contexts/categories/presentation/components/categories-tree";
import { CreateCategoryDialog } from "@/contexts/categories/presentation/components/create-category-dialog";
import { useCategories } from "@/contexts/categories/presentation/hooks/use-categories";

export default function CategoriesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: categories } = useCategories();

  // Root categories (no parentId) available as potential parents
  const rootCategories = (categories ?? []).filter((c) => !c.parentId);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Categorias</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie as categorias e subcategorias dos produtos.
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <CategoriesTree />

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Nova Categoria"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <CreateCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        parentCategories={rootCategories}
      />
    </div>
  );
}

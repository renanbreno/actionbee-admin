"use client";

import { useState } from "react";
import { Plus, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AffiliateCategoryFormDialog,
  AffiliateCategoriesTable,
} from "@/contexts/affiliate-categories/presentation/components";
import { useAffiliateCategories } from "@/contexts/affiliate-categories/presentation/hooks/use-affiliate-categories";

export default function AffiliateCategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: categories } = useAffiliateCategories(true);

  const total = categories?.length ?? 0;
  const activeCount = categories?.filter((c) => c.isActive).length ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <FolderTree className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Categorias de Afiliados
              </h1>
              {total > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total} {total === 1 ? "categoria" : "categorias"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Organize seus afiliados em categorias
              {activeCount > 0 && ` • ${activeCount} ativa${activeCount === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Table */}
      <AffiliateCategoriesTable />

      {/* Mobile FAB */}
      <button
        onClick={() => setIsCreateDialogOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Nova Categoria"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      {/* Dialogs */}
      <AffiliateCategoryFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

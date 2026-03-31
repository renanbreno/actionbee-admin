"use client";

import { Tag } from "lucide-react";
import { FinancialCategoriesList } from "@/contexts/financial/presentation/components/financial-categories-list";

export default function FinancialCategoriesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Tag className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Categorias</h1>
          <p className="text-xs text-muted-foreground">Categorias de receita e despesa</p>
        </div>
      </div>
      <FinancialCategoriesList />
    </div>
  );
}

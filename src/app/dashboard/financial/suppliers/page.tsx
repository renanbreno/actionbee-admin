"use client";

import { Building2 } from "lucide-react";
import { SuppliersList } from "@/contexts/financial/presentation/components/suppliers-list";

export default function SuppliersPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Building2 className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Fornecedores</h1>
          <p className="text-xs text-muted-foreground">Cadastro de fornecedores</p>
        </div>
      </div>
      <SuppliersList />
    </div>
  );
}

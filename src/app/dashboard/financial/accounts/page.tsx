"use client";

import { Landmark } from "lucide-react";
import { FinancialAccountsList } from "@/contexts/financial/presentation/components/financial-accounts-list";

export default function FinancialAccountsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Landmark className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Contas</h1>
          <p className="text-xs text-muted-foreground">Contas bancárias e caixa</p>
        </div>
      </div>
      <FinancialAccountsList />
    </div>
  );
}

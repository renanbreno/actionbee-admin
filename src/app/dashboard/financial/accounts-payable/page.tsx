"use client";

import { TrendingDown } from "lucide-react";
import { AccountPayablesList } from "@/contexts/financial/presentation/components/account-payables-list";

export default function AccountsPayablePage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <TrendingDown className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Contas a Pagar</h1>
          <p className="text-xs text-muted-foreground">Gerencie seus pagamentos</p>
        </div>
      </div>
      <AccountPayablesList />
    </div>
  );
}

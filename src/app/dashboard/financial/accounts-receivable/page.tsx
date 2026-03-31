"use client";

import { TrendingUp } from "lucide-react";
import { AccountReceivablesList } from "@/contexts/financial/presentation/components/account-receivables-list";

export default function AccountsReceivablePage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <TrendingUp className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Contas a Receber</h1>
          <p className="text-xs text-muted-foreground">Gerencie seus recebimentos</p>
        </div>
      </div>
      <AccountReceivablesList />
    </div>
  );
}

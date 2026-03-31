"use client";

import { Receipt } from "lucide-react";
import { FinancialTransactionsList } from "@/contexts/financial/presentation/components/financial-transactions-list";

export default function FinancialTransactionsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Receipt className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Lançamentos</h1>
          <p className="text-xs text-muted-foreground">Histórico de movimentações financeiras</p>
        </div>
      </div>
      <FinancialTransactionsList />
    </div>
  );
}

"use client";

import { Wallet } from "lucide-react";
import { FinancialDashboard } from "@/contexts/financial/presentation/components/financial-dashboard";

export default function FinancialDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Wallet className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Dashboard</h1>
          <p className="text-xs text-muted-foreground">Visão geral das finanças</p>
        </div>
      </div>
      <FinancialDashboard />
    </div>
  );
}

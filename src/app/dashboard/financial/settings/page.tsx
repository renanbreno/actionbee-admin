"use client";

import { Settings } from "lucide-react";
import { FinancialSettingsForm } from "@/contexts/financial/presentation/components/financial-settings-form";

export default function FinancialSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Settings className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">Financeiro — Configurações</h1>
          <p className="text-xs text-muted-foreground">Configurações de liquidação por método de pagamento</p>
        </div>
      </div>
      <FinancialSettingsForm />
    </div>
  );
}

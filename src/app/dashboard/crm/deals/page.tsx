"use client";

import { Kanban } from "lucide-react";
import { DealsKanban } from "@/contexts/crm/presentation/components/deals-kanban";

export default function DealsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Kanban className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">CRM — Negócios</h1>
          <p className="text-xs text-muted-foreground">Acompanhe seus negócios em andamento</p>
        </div>
      </div>
      <DealsKanban />
    </div>
  );
}

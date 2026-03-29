"use client";

import { MessageSquare } from "lucide-react";
import { InteractionsList } from "@/contexts/crm/presentation/components/interactions-list";

export default function InteractionsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <MessageSquare className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">CRM — Interações</h1>
          <p className="text-xs text-muted-foreground">Histórico de interações com clientes</p>
        </div>
      </div>
      <InteractionsList />
    </div>
  );
}

"use client";

import { GitBranch } from "lucide-react";
import { PipelinesList } from "@/contexts/crm/presentation/components/pipelines-list";

export default function PipelinesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <GitBranch className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">CRM — Pipelines</h1>
          <p className="text-xs text-muted-foreground">Gerencie seus funis de vendas</p>
        </div>
      </div>
      <PipelinesList />
    </div>
  );
}

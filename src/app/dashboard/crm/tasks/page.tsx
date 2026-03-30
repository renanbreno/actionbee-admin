"use client";

import { CheckSquare } from "lucide-react";
import { TasksKanban } from "@/contexts/crm/presentation/components/tasks-kanban";

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <CheckSquare className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">CRM — Tarefas</h1>
          <p className="text-xs text-muted-foreground">Gerencie suas tarefas e atividades</p>
        </div>
      </div>
      <TasksKanban />
    </div>
  );
}

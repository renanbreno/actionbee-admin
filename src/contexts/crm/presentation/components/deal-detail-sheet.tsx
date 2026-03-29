"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeal } from "../hooks/use-deal";
import { useInteractions } from "../hooks/use-interactions";
import { useTasks } from "../hooks/use-tasks";
import { useDeleteInteraction } from "../hooks/use-delete-interaction";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useUpdateTask } from "../hooks/use-update-task";
import { CreateInteractionDialog } from "./create-interaction-dialog";
import { CreateTaskDialog } from "./create-task-dialog";
import {
  Phone,
  Mail,
  Video,
  FileText,
  MessageCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractionType, TaskPriority, TaskStatus } from "../../domain/enums";
import type { Deal } from "../../domain/entities/deal";

const INTERACTION_ICONS: Record<string, React.ReactNode> = {
  [InteractionType.CALL]: <Phone className="h-3.5 w-3.5" />,
  [InteractionType.EMAIL]: <Mail className="h-3.5 w-3.5" />,
  [InteractionType.MEETING]: <Video className="h-3.5 w-3.5" />,
  [InteractionType.NOTE]: <FileText className="h-3.5 w-3.5" />,
  [InteractionType.WHATSAPP]: <MessageCircle className="h-3.5 w-3.5" />,
};

const INTERACTION_LABELS: Record<string, string> = {
  CALL: "Ligação", EMAIL: "E-mail", MEETING: "Reunião", NOTE: "Nota", WHATSAPP: "WhatsApp",
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  LOW: { label: "Baixa", className: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500", icon: null },
  MEDIUM: { label: "Média", className: "border-blue-500/30 bg-blue-500/10 text-blue-600", icon: null },
  HIGH: { label: "Alta", className: "border-orange-500/30 bg-orange-500/10 text-orange-600", icon: <AlertTriangle className="h-2.5 w-2.5" /> },
  URGENT: { label: "Urgente", className: "border-red-500/30 bg-red-500/10 text-red-600", icon: <Flame className="h-2.5 w-2.5" /> },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500" },
  IN_PROGRESS: { label: "Em andamento", className: "border-blue-500/30 bg-blue-500/10 text-blue-600" },
  COMPLETED: { label: "Concluída", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" },
  CANCELLED: { label: "Cancelada", className: "border-red-400/30 bg-red-400/10 text-red-500" },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

interface Props {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function DealDetailSheet({ deal, open, onOpenChange }: Props) {
  const { data: fullDeal } = useDeal(deal?.id ?? "");
  const current = fullDeal ?? deal;

  const { data: interactionsData } = useInteractions(1, 50, { dealId: deal?.id });
  const { data: tasksData } = useTasks(1, 50, { dealId: deal?.id });
  const interactions = interactionsData?.items ?? [];
  const tasks = tasksData?.items ?? [];

  const deleteInteraction = useDeleteInteraction();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const [createInteractionOpen, setCreateInteractionOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (!current) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-lg">{current.title}</SheetTitle>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{current.pipelineName}</Badge>
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs">
                {current.stageName}
              </Badge>
              {current.estimatedValue != null && (
                <span className="text-sm font-semibold text-bee-gold">
                  {formatCurrency(current.estimatedValue)}
                </span>
              )}
            </div>
          </SheetHeader>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-28 shrink-0">Cliente:</span>
              <span className="font-medium">{current.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-28 shrink-0">E-mail:</span>
              <span>{current.customerEmail}</span>
            </div>
            {current.expectedCloseDate && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-28 shrink-0">Fechamento:</span>
                <span>{formatDate(current.expectedCloseDate)}</span>
              </div>
            )}
            {current.source && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-28 shrink-0">Origem:</span>
                <span>{current.source}</span>
              </div>
            )}
            {current.description && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Descrição:</span>
                <p className="text-sm text-foreground/80 rounded-md bg-muted/50 p-2">
                  {current.description}
                </p>
              </div>
            )}
          </div>

          <Tabs defaultValue="interactions" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="interactions" className="flex-1">
                Interações ({interactions.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1">
                Tarefas ({tasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interactions" className="mt-4 space-y-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5"
                onClick={() => setCreateInteractionOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Interação
              </Button>
              {interactions.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhuma interação registrada
                </p>
              )}
              {interactions.map((i) => (
                <div key={i.id} className="rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 text-muted-foreground">
                        {INTERACTION_ICONS[i.type]}
                      </span>
                      <span className="font-medium shrink-0">
                        {INTERACTION_LABELS[i.type]}
                      </span>
                      {i.subject && (
                        <span className="text-muted-foreground truncate">— {i.subject}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground">{formatDate(i.occurredAt)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteInteraction.mutate(i.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{i.description}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tasks" className="mt-4 space-y-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5"
                onClick={() => setCreateTaskOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Tarefa
              </Button>
              {tasks.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhuma tarefa criada
                </p>
              )}
              {tasks.map((t) => (
                <div key={t.id} className="rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <button
                        type="button"
                        className="shrink-0"
                        title={t.status === TaskStatus.COMPLETED ? "Marcar como pendente" : "Marcar como concluída"}
                        onClick={() =>
                          updateTask.mutate({
                            id: t.id,
                            dto: {
                              title: t.title,
                              status: t.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED,
                              priority: t.priority,
                            },
                          })
                        }
                      >
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4 transition-colors",
                            t.status === TaskStatus.COMPLETED
                              ? "text-emerald-500"
                              : "text-muted-foreground/40"
                          )}
                        />
                      </button>
                      <span
                        className={cn(
                          "font-medium truncate",
                          t.status === TaskStatus.COMPLETED && "line-through text-muted-foreground"
                        )}
                      >
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {t.dueDate && (
                        <span className={cn(
                          "text-xs flex items-center gap-0.5",
                          new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED
                            ? "text-red-500"
                            : "text-muted-foreground"
                        )}>
                          <Clock className="h-2.5 w-2.5" />
                          {formatDate(t.dueDate)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask.mutate(t.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs gap-1", PRIORITY_CONFIG[t.priority]?.className)}
                    >
                      {PRIORITY_CONFIG[t.priority]?.icon}
                      {PRIORITY_CONFIG[t.priority]?.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", STATUS_CONFIG[t.status]?.className)}
                    >
                      {STATUS_CONFIG[t.status]?.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <CreateInteractionDialog
        open={createInteractionOpen}
        onOpenChange={setCreateInteractionOpen}
        defaultCustomerId={current.customerId}
        defaultDealId={current.id}
      />

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        defaultDealId={current.id}
        defaultCustomerId={current.customerId}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Clock,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractionType, TaskPriority, TaskStatus } from "../../domain/enums";
import type { Deal } from "../../domain/entities/deal";

const DEAL_SOURCE_LABELS: Record<string, string> = {
  ECOMMERCE: "E-commerce",
  LEAD_CAPTURE: "Captação de Lead",
  MANUAL: "Manual",
  REFERRAL: "Indicação",
};

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
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

interface Props {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function DealDetailSheet({ deal, open, onOpenChange }: Props) {
  const router = useRouter();
  const { data: fullDeal } = useDeal(deal?.id ?? "");
  const current = fullDeal ?? deal;

  const { data: interactionsData } = useInteractions(1, 50, { dealId: deal?.id });
  const { data: tasksData } = useTasks(1, 50, { dealId: deal?.id });
  const interactions = interactionsData?.items ?? [];
  const tasks = tasksData?.items ?? [];

  const deleteInteraction = useDeleteInteraction();
  const deleteTask = useDeleteTask();

  const [createInteractionOpen, setCreateInteractionOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (!current) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto flex flex-col gap-0 p-0">

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b">
            <SheetHeader>
              <SheetTitle className="text-xl leading-snug">{current.title}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline" className="text-xs">{current.pipelineName}</Badge>
              <span className="text-muted-foreground/40 text-xs">›</span>
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs">
                {current.stageName}
              </Badge>
              {current.estimatedValue != null && (
                <>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <span className="text-sm font-semibold text-bee-gold">
                    {formatCurrency(current.estimatedValue)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 py-5 border-b">
            <dl className="grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground self-center">Cliente</dt>
              <dd className="font-medium">{current.customerName}</dd>

              {current.customerEmail && (
                <>
                  <dt className="text-muted-foreground self-center">E-mail</dt>
                  <dd className="truncate">{current.customerEmail}</dd>
                </>
              )}

              {current.expectedCloseDate && (
                <>
                  <dt className="text-muted-foreground self-center">Fechamento</dt>
                  <dd>{formatDate(current.expectedCloseDate)}</dd>
                </>
              )}

              {current.source && (
                <>
                  <dt className="text-muted-foreground self-center">Origem</dt>
                  <dd>{DEAL_SOURCE_LABELS[current.source] ?? current.source}</dd>
                </>
              )}
            </dl>

            {current.description && (
              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</p>
                <p className="text-sm text-foreground/80 leading-relaxed rounded-md bg-muted/50 px-3 py-2.5">
                  {current.description}
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex-1 px-6 pt-5 pb-6">
            <Tabs defaultValue="interactions">
              <TabsList className="w-full">
                <TabsTrigger value="interactions" className="flex-1">
                  Interações {interactions.length > 0 && <span className="ml-1.5 text-xs opacity-60">({interactions.length})</span>}
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex-1">
                  Tarefas {tasks.length > 0 && <span className="ml-1.5 text-xs opacity-60">({tasks.length})</span>}
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

                {interactions.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhuma interação registrada
                  </p>
                ) : (
                  <div className="space-y-2">
                    {interactions.map((i) => (
                      <div key={i.id} className="rounded-lg border bg-card px-4 py-3 text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="shrink-0 text-muted-foreground">
                              {INTERACTION_ICONS[i.type]}
                            </span>
                            <span className="font-medium shrink-0">
                              {INTERACTION_LABELS[i.type] ?? i.type}
                            </span>
                            {i.subject && (
                              <span className="text-muted-foreground truncate text-xs">— {i.subject}</span>
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
                        {i.description && (
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 pl-5">
                            {i.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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

                {tasks.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhuma tarefa criada
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-lg border bg-card px-4 py-3 text-sm cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => {
                          onOpenChange(false);
                          router.push(`/dashboard/crm/tasks/${t.id}`);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span
                              className={cn(
                                "font-medium truncate",
                                t.status === TaskStatus.COMPLETED && "line-through text-muted-foreground"
                              )}
                            >
                              {t.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {t.dueDate && (
                              <span className={cn(
                                "text-xs flex items-center gap-1",
                                new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              )}>
                                <Clock className="h-3 w-3" />
                                {formatDate(t.dueDate)}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); deleteTask.mutate(t.id); }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center gap-2">
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
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

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

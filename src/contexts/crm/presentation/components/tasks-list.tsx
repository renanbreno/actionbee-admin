"use client";

import { useState } from "react";
import { useTasks } from "../hooks/use-tasks";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useUpdateTask } from "../hooks/use-update-task";
import { CreateTaskDialog } from "./create-task-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "../../domain/enums";
import type { Task } from "../../domain/entities/task";

const PRIORITY_CONFIG: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
  LOW: { label: "Baixa", className: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500" },
  MEDIUM: { label: "Média", className: "border-blue-500/30 bg-blue-500/10 text-blue-600" },
  HIGH: { label: "Alta", className: "border-orange-500/30 bg-orange-500/10 text-orange-600", icon: <AlertTriangle className="h-2.5 w-2.5" /> },
  URGENT: { label: "Urgente", className: "border-red-500/30 bg-red-500/10 text-red-600", icon: <Flame className="h-2.5 w-2.5" /> },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500" },
  IN_PROGRESS: { label: "Em andamento", className: "border-blue-500/30 bg-blue-500/10 text-blue-600" },
  COMPLETED: { label: "Concluída", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" },
  CANCELLED: { label: "Cancelada", className: "border-red-400/30 bg-red-400/10 text-red-500" },
};

function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;
  return (
    <Badge variant="outline" className={cn("text-xs gap-1", config.className)}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function isOverdue(dueDate: string, status: string) {
  return (
    status !== TaskStatus.COMPLETED &&
    status !== TaskStatus.CANCELLED &&
    new Date(dueDate) < new Date()
  );
}

export function TasksList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteTask();
  const updateMutation = useUpdateTask();

  const filters = {
    ...(statusFilter !== "ALL" ? { status: statusFilter as TaskStatus } : {}),
    ...(priorityFilter !== "ALL" ? { priority: priorityFilter as TaskPriority } : {}),
  };

  const { data, isLoading, isError } = useTasks(page, 20, Object.keys(filters).length > 0 ? filters : undefined);
  const tasks = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleDeleteRequest = (t: Task) => { setDeletingTask(t); setDeleteOpen(true); };

  const handleDeleteConfirm = () => {
    if (!deletingTask) return;
    deleteMutation.mutate(deletingTask.id, {
      onSuccess: () => { setDeleteOpen(false); setDeletingTask(null); },
    });
  };

  const handleToggleComplete = (t: Task) => {
    updateMutation.mutate({
      id: t.id,
      dto: {
        title: t.title,
        status: t.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED,
        priority: t.priority,
      },
    });
  };

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm animate-pulse space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      ))}
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar tarefas</p>}
      {!isLoading && !isError && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada</p>
        </div>
      )}
      {tasks.map((t) => (
        <div key={t.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <button
              type="button"
              className="mt-0.5 shrink-0"
              onClick={() => handleToggleComplete(t)}
            >
              <CheckCircle2
                className={cn(
                  "h-5 w-5 transition-colors",
                  t.status === TaskStatus.COMPLETED ? "text-emerald-500" : "text-muted-foreground/40"
                )}
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={cn(
                  "text-sm font-semibold",
                  t.status === TaskStatus.COMPLETED && "line-through text-muted-foreground"
                )}>
                  {t.title}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteRequest(t)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {t.dealTitle && (
                <p className="text-xs text-muted-foreground mt-0.5">Negócio: {t.dealTitle}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
                {t.dueDate && (
                  <span className={cn(
                    "text-xs flex items-center gap-0.5",
                    isOverdue(t.dueDate, t.status) ? "text-red-500" : "text-muted-foreground"
                  )}>
                    <Clock className="h-3 w-3" />
                    {formatDate(t.dueDate)}
                    {isOverdue(t.dueDate, t.status) && " (vencida)"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Tarefa</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Negócio</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 7 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-destructive py-8">
                Erro ao carregar tarefas
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                Nenhuma tarefa encontrada
              </TableCell>
            </TableRow>
          )}
          {tasks.map((t) => (
            <TableRow key={t.id} className={cn(t.status === TaskStatus.COMPLETED && "opacity-60")}>
              <TableCell>
                <button type="button" onClick={() => handleToggleComplete(t)}>
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4 transition-colors",
                      t.status === TaskStatus.COMPLETED ? "text-emerald-500" : "text-muted-foreground/40"
                    )}
                  />
                </button>
              </TableCell>
              <TableCell>
                <p className={cn(
                  "text-sm font-medium",
                  t.status === TaskStatus.COMPLETED && "line-through text-muted-foreground"
                )}>
                  {t.title}
                </p>
              </TableCell>
              <TableCell><PriorityBadge priority={t.priority} /></TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
              <TableCell>
                {t.dueDate ? (
                  <span className={cn(
                    "text-sm flex items-center gap-1",
                    isOverdue(t.dueDate, t.status) ? "text-red-500 font-medium" : "text-muted-foreground"
                  )}>
                    <Clock className="h-3 w-3" />
                    {formatDate(t.dueDate)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {t.dealTitle ?? "—"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteRequest(t)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe e gerencie suas tarefas</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Tarefa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      <div className="mb-4 flex gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            {Object.values(TaskStatus).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Prioridade..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as prioridades</SelectItem>
            {Object.values(TaskPriority).map((p) => (
              <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p]?.label ?? p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {mobileView}
      {desktopView}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tarefa <strong>{deletingTask?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "../hooks/use-tasks";
import { useUpdateTask } from "../hooks/use-update-task";

import { useDeleteTask } from "../hooks/use-delete-task";
import { EditTaskDialog } from "./edit-task-dialog";
import { CreateTaskDialog } from "./create-task-dialog";
import type { Task } from "../../domain/entities/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Clock,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "../../domain/enums";

const STATUS_COLUMNS: { value: TaskStatus; label: string; color: string }[] = [
  { value: TaskStatus.PENDING, label: "Pendente", color: "border-t-zinc-400" },
  { value: TaskStatus.IN_PROGRESS, label: "Em andamento", color: "border-t-blue-500" },
  { value: TaskStatus.COMPLETED, label: "Concluída", color: "border-t-emerald-500" },
  { value: TaskStatus.CANCELLED, label: "Cancelada", color: "border-t-red-400" },
];

const PRIORITY_CONFIG: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
  LOW: { label: "Baixa", className: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500" },
  MEDIUM: { label: "Média", className: "border-blue-500/30 bg-blue-500/10 text-blue-600" },
  HIGH: { label: "Alta", className: "border-orange-500/30 bg-orange-500/10 text-orange-600", icon: <AlertTriangle className="h-2.5 w-2.5" /> },
  URGENT: { label: "Urgente", className: "border-red-500/30 bg-red-500/10 text-red-600", icon: <Flame className="h-2.5 w-2.5" /> },
};

const PRIORITY_ORDER: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function isOverdue(dueDate: string, status: string) {
  return (
    status !== TaskStatus.COMPLETED &&
    status !== TaskStatus.CANCELLED &&
    new Date(dueDate) < new Date()
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function sortByPriority(tasks: Task[]) {
  return [...tasks].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99));
}

// ── Card content ───────────────────────────────────────────────────────────────
function TaskCardBody({ task }: { task: Task }) {
  return (
    <>
      <p className={cn(
        "text-sm font-semibold leading-tight line-clamp-2",
        task.status === TaskStatus.COMPLETED && "line-through text-muted-foreground"
      )}>
        {task.title}
      </p>
      {task.description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}
      {task.dealTitle && (
        <p className="mt-1 text-xs text-muted-foreground truncate">Negócio: {task.dealTitle}</p>
      )}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className={cn("text-xs gap-1", PRIORITY_CONFIG[task.priority]?.className)}>
          {PRIORITY_CONFIG[task.priority]?.icon}
          {PRIORITY_CONFIG[task.priority]?.label}
        </Badge>
        {task.dueDate && (
          <span className={cn(
            "text-xs flex items-center gap-0.5",
            isOverdue(task.dueDate, task.status) ? "text-red-500 font-medium" : "text-muted-foreground"
          )}>
            <Clock className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </>
  );
}

// ── Draggable task card ────────────────────────────────────────────────────────
interface TaskCardProps {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-bee-gold/50 transition-colors",
        isDragging && "opacity-40",
        task.status === TaskStatus.COMPLETED && "opacity-60"
      )}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <TaskCardBody task={task} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 -mr-1 -mt-0.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
              <Pencil className="mr-2 h-3.5 w-3.5" />Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ── Drag overlay ───────────────────────────────────────────────────────────────
function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-bee-gold/60 bg-card p-3 shadow-2xl w-72 rotate-1 opacity-95">
      <TaskCardBody task={task} />
    </div>
  );
}

// ── Droppable status column ────────────────────────────────────────────────────
interface StatusColumnProps {
  column: (typeof STATUS_COLUMNS)[number];
  tasks: Task[];
  isLoading: boolean;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}

function StatusColumn({ column, tasks, isLoading, onEdit, onDelete }: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.value });

  return (
    <div
      className={cn(
        "flex-none w-72 rounded-xl border border-t-4 flex flex-col transition-colors",
        column.color,
        isOver ? "bg-bee-gold/5" : "bg-muted/30"
      )}
    >
      <div className="px-3 py-2.5 border-b flex items-center gap-2">
        <span className="text-sm font-semibold truncate">{column.label}</span>
        <Badge variant="secondary" className="text-xs shrink-0">{tasks.length}</Badge>
      </div>

      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-30">
        {isLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && tasks.length === 0 && (
          <div
            className={cn(
              "flex items-center justify-center h-16 rounded-lg border-2 border-dashed transition-colors",
              isOver ? "border-bee-gold/50 bg-bee-gold/10" : "border-muted-foreground/20"
            )}
          >
            <p className="text-xs text-muted-foreground">
              {isOver ? "Soltar aqui" : "Sem tarefas"}
            </p>
          </div>
        )}
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

// ── Main kanban board ─────────────────────────────────────────────────────────
export function TasksKanban() {
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const { data, isLoading } = useTasks(1, 100);
  const tasks = data?.items ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleEdit = (t: Task) => { setEditingTask(t); setEditOpen(true); };
  const handleDeleteRequest = (t: Task) => { setDeletingTask(t); setDeleteOpen(true); };

  const handleDeleteConfirm = () => {
    if (!deletingTask) return;
    deleteMutation.mutate(deletingTask.id, {
      onSuccess: () => { setDeleteOpen(false); setDeletingTask(null); },
    });
  };

  const tasksByStatus = (status: TaskStatus) =>
    sortByPriority(tasks.filter((t) => t.status === status));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task as Task | undefined;
    const newStatus = over.id as TaskStatus;

    if (!task || task.status === newStatus) return;

    updateMutation.mutate({
      id: task.id,
      dto: {
        title: task.title,
        status: newStatus,
        priority: task.priority,
      },
    });
  };

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
          {tasks.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Tarefa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {STATUS_COLUMNS.map((col) => (
            <StatusColumn
              key={col.value}
              column={col}
              tasks={tasksByStatus(col.value)}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditTaskDialog task={editingTask} open={editOpen} onOpenChange={setEditOpen} />

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

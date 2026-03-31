"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { updateTaskSchema, type UpdateTaskFormValues } from "../schemas/task.schema";
import { useUpdateTask } from "../hooks/use-update-task";
import { maskDate, unmaskDate, formatDate } from "@/shared/utils/masks";
import { TaskPriority, TaskStatus } from "../../domain/enums";
import type { Task } from "../../domain/entities/task";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

interface Props {
  task: Task | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: Props) {
  const updateMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: { title: "", description: "", status: TaskStatus.PENDING, priority: TaskPriority.MEDIUM, dueDate: "" },
  });

  const statusValue = watch("status");
  const priorityValue = watch("priority");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? formatDate(task.dueDate) : "",
      });
    }
  }, [task, reset]);

  const onSubmit = (values: UpdateTaskFormValues) => {
    if (!task) return;
    const isoDate = unmaskDate(values.dueDate ?? "");
    updateMutation.mutate(
      { id: task.id, dto: { ...values, dueDate: isoDate ?? undefined } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-task-title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input id="edit-task-title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusValue} onValueChange={(v) => setValue("status", v as TaskStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priorityValue} onValueChange={(v) => setValue("priority", v as TaskPriority)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskPriority).map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-task-due">
              Prazo <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="edit-task-due"
                type="text"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className="pl-9"
                {...register("dueDate", {
                  onChange: (e) => {
                    const masked = maskDate(e.target.value);
                    setValue("dueDate", masked);
                  },
                })}
              />
            </div>
            {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-task-desc">
              Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea id="edit-task-desc" rows={3} {...register("description")} />
          </div>

          <DialogActions
            isLoading={updateMutation.isPending}
            submitLabel="Salvar"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

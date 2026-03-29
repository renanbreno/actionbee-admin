"use client";

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
import { createTaskSchema, type CreateTaskFormValues } from "../schemas/task.schema";
import { useCreateTask } from "../hooks/use-create-task";
import { useAuth } from "@/contexts/auth/presentation/hooks/use-auth";
import { maskDate, unmaskDate } from "@/shared/utils/masks";
import { TaskType, TaskPriority } from "../../domain/enums";

const TASK_TYPE_LABELS: Record<string, string> = {
  FOLLOW_UP: "Follow-up",
  CALL: "Ligação",
  EMAIL: "E-mail",
  MEETING: "Reunião",
  OTHER: "Outro",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDealId?: string;
  defaultCustomerId?: string;
}

export function CreateTaskDialog({ open, onOpenChange, defaultDealId, defaultCustomerId }: Props) {
  const createMutation = useCreateTask();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      type: TaskType.FOLLOW_UP,
      description: "",
      dealId: defaultDealId ?? "",
      customerId: defaultCustomerId ?? "",
      priority: TaskPriority.MEDIUM,
      dueDate: "",
    },
  });

  const typeValue = watch("type");
  const priorityValue = watch("priority");

  const onSubmit = (values: CreateTaskFormValues) => {
    const isoDate = unmaskDate(values.dueDate ?? "");
    createMutation.mutate(
      {
        ...values,
        dealId: values.dealId || undefined,
        customerId: values.customerId || undefined,
        dueDate: isoDate ?? undefined,
        assignedAdminId: user?.id,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="task-title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input id="task-title" placeholder="Ex: Ligar para cliente" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Tipo <span className="text-destructive">*</span>
              </Label>
              <Select value={typeValue} onValueChange={(v) => setValue("type", v as TaskType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskType).map((t) => (
                    <SelectItem key={t} value={t}>{TASK_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Prioridade <span className="text-destructive">*</span>
              </Label>
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
            <Label htmlFor="task-due">
              Prazo <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="task-due"
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
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc">
              Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea id="task-desc" rows={3} placeholder="Detalhes da tarefa..." {...register("description")} />
          </div>

          <DialogActions
            isLoading={createMutation.isPending}
            submitLabel="Criar Tarefa"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

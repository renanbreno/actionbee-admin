"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AbandonedCart } from "../../domain/entities/abandoned-cart.entity";
import { useCreateTask } from "@/contexts/crm/presentation/hooks/use-create-task";
import { useCreateDeal } from "@/contexts/crm/presentation/hooks/use-create-deal";
import { usePipelines } from "@/contexts/crm/presentation/hooks/use-pipelines";
import { TaskType, TaskPriority } from "@/contexts/crm/domain/enums";

/* ─── Schemas ─── */

const taskSchema = z.object({
  type: z.enum(["FOLLOW_UP", "CALL", "EMAIL", "MEETING"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
});

const dealSchema = z.object({
  pipelineId: z.string().min(1, "Selecione um pipeline"),
  stageId: z.string().min(1, "Selecione um estágio"),
});

type TaskFormValues = z.infer<typeof taskSchema>;
type DealFormValues = z.infer<typeof dealSchema>;

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "R$ 0,00";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ─── Cart Summary ─── */
function CartSummaryCard({ cart }: { cart: AbandonedCart }) {
  const itemsText = cart.items
    .slice(0, 3)
    .map((item) => `${item.name} (x${item.quantity})`)
    .join(", ");
  const moreCount = cart.items.length - 3;

  return (
    <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">{cart.customerName}</span>
        <span className="font-semibold text-bee-gold">{formatCurrency(cart.cartValue)}</span>
      </div>
      <p className="text-xs text-muted-foreground">{cart.customerEmail}</p>
      {itemsText && (
        <p className="text-xs text-muted-foreground truncate">
          {itemsText}
          {moreCount > 0 && ` +${moreCount} mais`}
        </p>
      )}
      <p className="text-xs text-muted-foreground">Abandonado em {formatDate(cart.abandonedAt)}</p>
    </div>
  );
}

/* ─── Task Tab ─── */
function CreateTaskTab({ cart, onSuccess }: { cart: AbandonedCart; onSuccess: () => void }) {
  const createTask = useCreateTask();
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: TaskType.FOLLOW_UP,
      priority: TaskPriority.HIGH,
      dueDate: "",
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    const itemsText = cart.items
      .slice(0, 5)
      .map((item) => `• ${item.name} (x${item.quantity})`)
      .join("\n");
    const description = `Carrinho de ${formatCurrency(cart.cartValue)} abandonado em ${formatDate(cart.abandonedAt)}.\n\nItens:\n${itemsText || "Sem itens"}`;

    createTask.mutate(
      {
        title: `Follow-up carrinho abandonado — ${cart.customerName}`,
        type: data.type,
        priority: data.priority,
        customerId: cart.customerId || undefined,
        description,
        dueDate: data.dueDate || undefined,
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CartSummaryCard cart={cart} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Tipo de tarefa</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskType.FOLLOW_UP}>Follow-up</SelectItem>
                  <SelectItem value={TaskType.CALL}>Ligação</SelectItem>
                  <SelectItem value={TaskType.EMAIL}>E-mail</SelectItem>
                  <SelectItem value={TaskType.MEETING}>Reunião</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Prioridade</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.LOW}>Baixa</SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>Média</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>Alta</SelectItem>
                  <SelectItem value={TaskPriority.URGENT}>Urgente</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Prazo (opcional)</Label>
        <Input type="date" {...register("dueDate")} />
        {errors.dueDate && <p className="text-destructive text-xs">{errors.dueDate.message}</p>}
      </div>

      <DialogActions
        isLoading={createTask.isPending}
        loadingText="Criando tarefa..."
        submitLabel="Criar Tarefa"
        onCancel={onSuccess}
      />
    </form>
  );
}

/* ─── Deal Tab ─── */
function CreateDealTab({ cart, onSuccess }: { cart: AbandonedCart; onSuccess: () => void }) {
  const createDeal = useCreateDeal();
  const { data: pipelinesData } = usePipelines();
  const pipelines = pipelinesData ?? [];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: { pipelineId: "", stageId: "" },
  });

  const selectedPipelineId = watch("pipelineId");
  const selectedPipeline = pipelines.find((p) => p.id === selectedPipelineId);
  const stages = selectedPipeline?.stages ?? [];

  const onSubmit = (data: DealFormValues) => {
    const itemsText = cart.items
      .slice(0, 5)
      .map((item) => `• ${item.name} (x${item.quantity})`)
      .join("\n");
    const description = `Carrinho de ${formatCurrency(cart.cartValue)} abandonado em ${formatDate(cart.abandonedAt)}.\n\nItens:\n${itemsText || "Sem itens"}`;

    createDeal.mutate(
      {
        title: `Recuperação de carrinho — ${cart.customerName}`,
        customerId: cart.customerId ?? "",
        pipelineId: data.pipelineId,
        stageId: data.stageId,
        estimatedValue: cart.cartValue ?? undefined,
        source: "ECOMMERCE",
        description,
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CartSummaryCard cart={cart} />

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Pipeline</Label>
        <Controller
          name="pipelineId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.pipelineId && <p className="text-destructive text-xs">{errors.pipelineId.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Estágio</Label>
        <Controller
          name="stageId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!selectedPipelineId || stages.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedPipelineId ? "Selecione um estágio" : "Selecione um pipeline primeiro"} />
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.stageId && <p className="text-destructive text-xs">{errors.stageId.message}</p>}
      </div>

      <DialogActions
        isLoading={createDeal.isPending}
        loadingText="Criando negócio..."
        submitLabel="Criar Negócio"
        onCancel={onSuccess}
      />
    </form>
  );
}

/* ─── Main Dialog ─── */
interface CartCrmQuickActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: AbandonedCart | null;
}

export function CartCrmQuickActionDialog({
  open,
  onOpenChange,
  cart,
}: CartCrmQuickActionDialogProps) {
  const [tab, setTab] = useState("task");

  if (!cart) return null;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ação CRM</DialogTitle>
          <DialogDescription>
            Crie uma tarefa ou negócio a partir deste carrinho abandonado.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="task">Criar Tarefa</TabsTrigger>
            <TabsTrigger value="deal">Criar Negócio</TabsTrigger>
          </TabsList>
          <TabsContent value="task" className="mt-4">
            <CreateTaskTab cart={cart} onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="deal" className="mt-4">
            <CreateDealTab cart={cart} onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogActions,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stockAdjustmentSchema, StockAdjustmentFormValues } from "../schemas/stock-adjustment.schema";
import { useAddStockAdjustment } from "../hooks/use-add-stock-adjustment";
import { useProductBatches } from "../hooks/use-product-batches";

interface AddStockAdjustmentDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStockAdjustmentDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: AddStockAdjustmentDialogProps) {
  const mutation = useAddStockAdjustment(productId);
  const { data: batches = [] } = useProductBatches(open ? productId : null, true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: { operation: "add" },
  });

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  async function onSubmit(values: StockAdjustmentFormValues) {
    const signedQuantity =
      values.operation === "remove" ? -values.quantity : values.quantity;

    await mutation.mutateAsync({
      quantity: signedQuantity,
      reason: values.reason || undefined,
      batchId: values.batchId || undefined,
    });
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuste de Estoque</DialogTitle>
          <p className="text-sm text-muted-foreground">{productName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Operação</Label>
              <Controller
                name="operation"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Adicionar</SelectItem>
                      <SelectItem value="remove">Remover</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adj-quantity">Quantidade</Label>
              <Input
                id="adj-quantity"
                type="number"
                min={1}
                placeholder="Ex: 10"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-destructive text-sm">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lote (opcional)</Label>
            <Controller
              name="batchId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? "__none__"}
                  onValueChange={(v) => field.onChange(v === "__none__" ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum lote específico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhum lote específico</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        <span className="font-mono">{batch.batchNumber}</span>
                        <span className="ml-2 text-muted-foreground">
                          ({batch.currentQuantity} un.
                          {!batch.isActive && " · esgotado"})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adj-reason">Motivo (opcional)</Label>
            <Input
              id="adj-reason"
              placeholder="Ex: Inventário físico, perda, brinde..."
              {...register("reason")}
            />
          </div>

          <DialogActions
            isLoading={mutation.isPending}
            submitLabel="Confirmar Ajuste"
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import {
  giftStockAdjustmentSchema,
  GiftStockAdjustmentFormValues,
} from "../schemas/gift-stock-adjustment.schema";
import { useAddGiftStockAdjustment } from "../hooks/use-add-gift-stock-adjustment";

interface AddGiftStockAdjustmentDialogProps {
  giftTierId: string;
  giftName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGiftStockAdjustmentDialog({
  giftTierId,
  giftName,
  open,
  onOpenChange,
}: AddGiftStockAdjustmentDialogProps) {
  const mutation = useAddGiftStockAdjustment(giftTierId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GiftStockAdjustmentFormValues>({
    resolver: zodResolver(giftStockAdjustmentSchema),
    defaultValues: { operation: "add" },
  });

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  async function onSubmit(values: GiftStockAdjustmentFormValues) {
    try {
      await mutation.mutateAsync(values);
      handleClose();
    } catch {
      // error handled by onError toast in the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuste de Estoque</DialogTitle>
          <p className="text-sm text-muted-foreground">{giftName}</p>
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
            <Label htmlFor="adj-reason">Motivo (opcional)</Label>
            <Input
              id="adj-reason"
              placeholder="Ex: Inventário físico, perda..."
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

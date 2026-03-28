"use client";

import { useForm } from "react-hook-form";
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
  giftStockEntrySchema,
  GiftStockEntryFormValues,
} from "../schemas/gift-stock-entry.schema";
import { useAddGiftStockEntry } from "../hooks/use-add-gift-stock-entry";

interface AddGiftStockEntryDialogProps {
  giftTierId: string;
  giftName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGiftStockEntryDialog({
  giftTierId,
  giftName,
  open,
  onOpenChange,
}: AddGiftStockEntryDialogProps) {
  const mutation = useAddGiftStockEntry(giftTierId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GiftStockEntryFormValues>({
    resolver: zodResolver(giftStockEntrySchema),
  });

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  async function onSubmit(values: GiftStockEntryFormValues) {
    try {
      await mutation.mutateAsync({ quantity: values.quantity, reason: values.reason || undefined });
      handleClose();
    } catch {
      // error handled by onError toast in the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Estoque</DialogTitle>
          <p className="text-sm text-muted-foreground">{giftName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entry-quantity">Quantidade</Label>
            <Input
              id="entry-quantity"
              type="number"
              min={1}
              placeholder="Ex: 50"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-destructive text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-reason">Motivo (opcional)</Label>
            <Input
              id="entry-reason"
              placeholder="Ex: Reposição de estoque"
              {...register("reason")}
            />
          </div>

          <DialogActions
            isLoading={mutation.isPending}
            submitLabel="Adicionar"
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

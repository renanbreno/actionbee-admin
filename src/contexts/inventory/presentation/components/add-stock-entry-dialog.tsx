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
import { stockEntrySchema, StockEntryFormValues } from "../schemas/stock-entry.schema";
import { useAddStockEntry } from "../hooks/use-add-stock-entry";
import { maskDate, unmaskDate } from "@/shared/utils/masks";

interface AddStockEntryDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStockEntryDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: AddStockEntryDialogProps) {
  const mutation = useAddStockEntry(productId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StockEntryFormValues>({
    resolver: zodResolver(stockEntrySchema),
  });

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  async function onSubmit(values: StockEntryFormValues) {
    await mutation.mutateAsync({
      ...values,
      expiryDate: unmaskDate(values.expiryDate) ?? values.expiryDate,
      manufacturingDate: values.manufacturingDate
        ? (unmaskDate(values.manufacturingDate) ?? values.manufacturingDate)
        : undefined,
    });
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Entrada de Estoque</DialogTitle>
          <p className="text-sm text-muted-foreground">{productName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Número do Lote</Label>
            <Input
              id="batchNumber"
              placeholder="Ex: LOT-2026-001"
              {...register("batchNumber")}
            />
            {errors.batchNumber && (
              <p className="text-destructive text-sm">{errors.batchNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Data de Fabricação</Label>
              <Input
                id="manufacturingDate"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                {...register("manufacturingDate", {
                  onChange: (e) => setValue("manufacturingDate", maskDate(e.target.value)),
                })}
              />
              {errors.manufacturingDate && (
                <p className="text-destructive text-sm">{errors.manufacturingDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Data de Validade *</Label>
              <Input
                id="expiryDate"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                {...register("expiryDate", {
                  onChange: (e) => setValue("expiryDate", maskDate(e.target.value)),
                })}
              />
              {errors.expiryDate && (
                <p className="text-destructive text-sm">{errors.expiryDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              placeholder="Ex: 200"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-destructive text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <DialogActions
            isLoading={mutation.isPending}
            submitLabel="Adicionar Lote"
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

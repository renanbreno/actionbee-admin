"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateCategorySchema, type UpdateCategoryFormValues } from "../schemas/category.schema";
import { useUpdateFinancialCategory } from "../hooks/use-financial-categories";
import type { FinancialCategory } from "../../domain/entities/category";

interface Props {
  category: FinancialCategory | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: Props) {
  const updateMutation = useUpdateFinancialCategory();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
  });

  const activeValue = watch("active");

  useEffect(() => {
    if (category && open) {
      reset({ name: category.name, color: category.color ?? "", active: category.active });
    }
  }, [category, open, reset]);

  const onSubmit = (values: UpdateCategoryFormValues) => {
    if (!category) return;
    updateMutation.mutate(
      { id: category.id, data: { name: values.name, color: values.color || undefined, active: values.active } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-cat-name">Nome <span className="text-destructive">*</span></Label>
            <Input id="edit-cat-name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cat-color">Cor</Label>
            <Input id="edit-cat-color" type="color" className="h-10 w-full cursor-pointer" {...register("color")} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Ativa</p>
              <p className="text-xs text-muted-foreground">Categoria disponível para uso</p>
            </div>
            <Switch checked={activeValue ?? true} onCheckedChange={(v) => setValue("active", v)} />
          </div>

          <DialogActions isLoading={updateMutation.isPending} submitLabel="Salvar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

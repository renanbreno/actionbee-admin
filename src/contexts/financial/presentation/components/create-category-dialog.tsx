"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCategorySchema, type CreateCategoryFormValues } from "../schemas/category.schema";
import { useCreateFinancialCategory } from "../hooks/use-financial-categories";
import { ColorPicker } from "./color-picker";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateCategoryDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateFinancialCategory();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "", type: "INCOME", color: "" },
  });

  const typeValue = watch("type");

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const onSubmit = (values: CreateCategoryFormValues) => {
    createMutation.mutate(
      { name: values.name, type: values.type, color: values.color || undefined },
      { onSuccess: () => { reset(); onOpenChange(false); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nome <span className="text-destructive">*</span></Label>
            <Input id="cat-name" placeholder="Ex: Vendas, Aluguel..." {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tipo <span className="text-destructive">*</span></Label>
            <Select value={typeValue} onValueChange={(v) => setValue("type", v as "INCOME" | "EXPENSE")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Receita</SelectItem>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Cor <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <ColorPicker value={watch("color") ?? ""} onChange={(v) => setValue("color", v)} />
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Criar Categoria" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

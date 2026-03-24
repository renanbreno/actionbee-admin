"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  productGroupSchema,
  ProductGroupFormValues,
} from "../schemas/product-group.schema";
import { useUpdateProductGroup } from "../hooks/use-update-product-group";
import { ProductPicker } from "./product-picker";
import { ProductGroup } from "../../domain/entities/product-group";

interface EditProductGroupDialogProps {
  group: ProductGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductGroupDialog({
  group,
  open,
  onOpenChange,
}: EditProductGroupDialogProps) {
  const updateMutation = useUpdateProductGroup();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductGroupFormValues>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: { name: group.name, productIds: group.productIds },
  });

  // Reset form when group changes
  useEffect(() => {
    reset({ name: group.name, productIds: group.productIds });
  }, [group, reset]);

  const onSubmit = (data: ProductGroupFormValues) => {
    updateMutation.mutate(
      { id: group.id, dto: { name: data.name, productIds: data.productIds } },
      {
        onSuccess: () => {
          toast.success("Grupo atualizado com sucesso!");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao atualizar grupo.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Grupo</DialogTitle>
          <DialogDescription>
            Altere o nome ou os produtos vinculados a este grupo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Nome do grupo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Ex: Gel de Carbo"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Produtos */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Produtos <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <ProductPicker
                  selectedIds={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.productIds && (
              <p className="text-destructive text-sm">{errors.productIds.message}</p>
            )}
          </div>

          <DialogActions
            isLoading={updateMutation.isPending}
            loadingText="Salvando..."
            submitLabel="Salvar Alterações"
            onCancel={() => onOpenChange(false)}
            submitButtonProps={{ className: "min-w-[150px]" }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

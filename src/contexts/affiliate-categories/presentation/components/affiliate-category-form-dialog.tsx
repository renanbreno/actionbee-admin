"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";
import {
  createAffiliateCategoryFormSchema,
  AffiliateCategoryFormValues,
} from "../schemas/affiliate-category.schema";
import { useCreateAffiliateCategory } from "../hooks/use-create-affiliate-category";
import { useUpdateAffiliateCategory } from "../hooks/use-update-affiliate-category";

interface AffiliateCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AffiliateCategory | null;
}

export function AffiliateCategoryFormDialog({
  open,
  onOpenChange,
  category,
}: AffiliateCategoryFormDialogProps) {
  const isEditing = !!category;
  const createMutation = useCreateAffiliateCategory();
  const updateMutation = useUpdateAffiliateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AffiliateCategoryFormValues>({
    resolver: zodResolver(createAffiliateCategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [category, reset]);

  const onSubmit = (data: AffiliateCategoryFormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: category!.id, data },
        {
          onSuccess: () => {
            toast.success("Categoria atualizada com sucesso!");
            reset();
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(error.message ?? "Erro ao atualizar categoria. Tente novamente.");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Categoria criada com sucesso!");
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message ?? "Erro ao criar categoria. Tente novamente.");
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da categoria de afiliado."
              : "Cadastre uma nova categoria para organizar seus afiliados."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="cat-name" className="text-sm font-medium">
              Nome da categoria <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cat-name"
              placeholder="Ex: Influenciadores"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="cat-description" className="text-sm font-medium">
              Descrição{" "}
              <span className="text-muted-foreground/60 font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="cat-description"
              placeholder="Descreva o objetivo desta categoria..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <DialogActions
            isLoading={createMutation.isPending || updateMutation.isPending}
            loadingText="Salvando..."
            submitLabel={isEditing ? "Salvar Alterações" : "Criar Categoria"}
            onCancel={handleClose}
            submitButtonProps={{
              className: "min-w-[140px]",
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import {
  updateGiftTierSchema,
  UpdateGiftTierFormValues,
} from "../schemas/gift-tier.schema";
import { useUpdateGiftTier } from "../hooks/use-update-gift-tier";
import { GiftTier } from "../../domain/entities/gift-tier";

interface EditGiftTierDialogProps {
  giftTier: GiftTier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGiftTierDialog({
  giftTier,
  open,
  onOpenChange,
}: EditGiftTierDialogProps) {
  const updateMutation = useUpdateGiftTier();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateGiftTierFormValues>({
    resolver: zodResolver(updateGiftTierSchema),
  });

  useEffect(() => {
    if (giftTier && open) {
      reset({
        name: giftTier.name,
        description: giftTier.description ?? "",
        imageUrl: giftTier.imageUrl ?? "",
        minOrderValue: giftTier.minOrderValue,
        productId: giftTier.productId ?? "",
      });
    }
    if (!open) reset();
  }, [giftTier, open, reset]);

  const onSubmit = (values: UpdateGiftTierFormValues) => {
    if (!giftTier) return;
    updateMutation.mutate(
      { id: giftTier.id, data: values },
      {
        onSuccess: () => {
          toast.success("Brinde atualizado com sucesso!");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message ?? "Erro ao atualizar brinde");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Pencil className="h-4 w-4 text-bee-gold" />
            Editar Brinde
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nome do brinde <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Ex: Sacola personalizada"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">
              Descrição{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Descreva o brinde..."
              className="resize-none"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-minOrderValue">
              Valor mínimo do pedido (R$) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-minOrderValue"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Ex: 150.00"
              {...register("minOrderValue", { valueAsNumber: true })}
            />
            {errors.minOrderValue && (
              <p className="text-sm text-destructive">{errors.minOrderValue.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-imageUrl">
              URL da imagem{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="edit-imageUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-productId">
              ID do produto vinculado{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="edit-productId"
              placeholder="ID do produto no catálogo"
              {...register("productId")}
            />
            {errors.productId && (
              <p className="text-sm text-destructive">{errors.productId.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full bg-bee-gold text-black hover:bg-bee-amber sm:w-auto"
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

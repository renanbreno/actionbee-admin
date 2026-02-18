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
import { Gift, Loader2 } from "lucide-react";
import {
  createGiftTierSchema,
  CreateGiftTierFormValues,
} from "../schemas/gift-tier.schema";
import { useCreateGiftTier } from "../hooks/use-create-gift-tier";

interface CreateGiftTierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGiftTierDialog({
  open,
  onOpenChange,
}: CreateGiftTierDialogProps) {
  const createMutation = useCreateGiftTier();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGiftTierFormValues>({
    resolver: zodResolver(createGiftTierSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      minOrderValue: undefined,
      productId: "",
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (values: CreateGiftTierFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Brinde criado com sucesso!");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message ?? "Erro ao criar brinde");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Gift className="h-4 w-4 text-bee-gold" />
            Novo Brinde
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="create-name">
              Nome do brinde <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-name"
              placeholder="Ex: Sacola personalizada"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-description">
              Descrição{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="create-description"
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
            <Label htmlFor="create-minOrderValue">
              Valor mínimo do pedido (R$) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-minOrderValue"
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
            <Label htmlFor="create-imageUrl">
              URL da imagem{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="create-imageUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-productId">
              ID do produto vinculado{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="create-productId"
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
              disabled={createMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-bee-gold text-black hover:bg-bee-amber sm:w-auto"
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar brinde
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

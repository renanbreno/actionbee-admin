"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Gift, Upload, X } from "lucide-react";
import {
  createGiftTierSchema,
  CreateGiftTierFormValues,
} from "../schemas/gift-tier.schema";
import { useCreateGiftTier } from "../hooks/use-create-gift-tier";
import { CurrencyInput } from "@/shared/presentation/components/currency-input";

interface CreateGiftTierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGiftTierDialog({
  open,
  onOpenChange,
}: CreateGiftTierDialogProps) {
  const createMutation = useCreateGiftTier();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateGiftTierFormValues>({
    resolver: zodResolver(createGiftTierSchema),
    defaultValues: {
      name: "",
      description: undefined,
      minOrderValue: 0,
      costPrice: 0,
      productId: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setImageFile(null);
    }
  }, [open, reset]);

  const onSubmit = (values: CreateGiftTierFormValues) => {
    createMutation.mutate(
      { ...values, image: imageFile ?? undefined },
      {
        onSuccess: () => {
          toast.success("Brinde criado com sucesso!");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message ?? "Erro ao criar brinde");
        },
      }
    );
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

          <Controller
            name="minOrderValue"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="create-minOrderValue"
                label="Valor mínimo do pedido (R$)"
                value={field.value}
                onChange={field.onChange}
                error={errors.minOrderValue?.message}
                required
              />
            )}
          />

          <Controller
            name="costPrice"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="create-costPrice"
                label="Preço de custo (R$)"
                value={field.value}
                onChange={field.onChange}
                error={errors.costPrice?.message}
                required
              />
            )}
          />

          {/* Imagem */}
          <div className="space-y-2">
            <Label>
              Imagem{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {imageFile ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{imageFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(imageFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => { setImageFile(null); if (inputRef.current) inputRef.current.value = ""; }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-bee-gold hover:bg-bee-gold/5 transition-colors text-sm text-muted-foreground hover:text-foreground w-full justify-center"
              >
                <Upload className="h-4 w-4 shrink-0" />
                Selecionar imagem
              </button>
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

          <DialogActions
            isLoading={createMutation.isPending}
            submitLabel="Criar brinde"
            onCancel={() => onOpenChange(false)}
            submitButtonProps={{
              className: "bg-bee-gold text-black hover:bg-bee-amber",
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

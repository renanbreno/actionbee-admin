"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Package,
  Sparkles,
  Store,
  Info,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createCouponSchema,
  CreateCouponFormValues,
  CreateCouponFormInput,
} from "../schemas/coupon.schema";
import { useCreateCoupon } from "../hooks/use-create-coupon";
import { CurrencyInput } from "@/shared/presentation/components/currency-input";

const typeOptions = [
  {
    value: "STORE_WIDE" as const,
    label: "Loja toda",
    icon: Store,
    color: "border-blue-500/40 bg-blue-500/5 text-blue-700 hover:bg-blue-500/10",
    activeColor: "border-blue-500 bg-blue-500/15 text-blue-700 ring-2 ring-blue-500/20",
  },
  {
    value: "FIRST_PURCHASE" as const,
    label: "1ª compra",
    icon: Sparkles,
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10",
    activeColor: "border-emerald-500 bg-emerald-500/15 text-emerald-700 ring-2 ring-emerald-500/20",
  },
  {
    value: "BY_PRODUCT" as const,
    label: "Produto",
    icon: Package,
    color: "border-amber-500/40 bg-amber-500/5 text-amber-700 hover:bg-amber-500/10",
    activeColor: "border-amber-500 bg-amber-500/15 text-amber-700 ring-2 ring-amber-500/20",
  },
  {
    value: "BY_CUSTOMER" as const,
    label: "Cliente",
    icon: ShoppingCart,
    color: "border-purple-500/40 bg-purple-500/5 text-purple-700 hover:bg-purple-500/10",
    activeColor: "border-purple-500 bg-purple-500/15 text-purple-700 ring-2 ring-purple-500/20",
  },
];

interface CreateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCouponDialog({
  open,
  onOpenChange,
}: CreateCouponDialogProps) {
  const createMutation = useCreateCoupon();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCouponFormInput, unknown, CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      type: "STORE_WIDE",
      discountPercentage: undefined as unknown as number,
      maxDiscountAmount: undefined,
      minCartValue: undefined,
      expiresAt: undefined,
      usageLimit: undefined,
      customerEmail: "",
      productId: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = (data: CreateCouponFormValues) => {
    createMutation.mutate(
      {
        code: data.code,
        type: data.type,
        discountPercentage: data.discountPercentage,
        maxDiscountAmount: data.maxDiscountAmount,
        minCartValue: data.minCartValue,
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
        usageLimit: data.usageLimit,
        customerEmail: data.customerEmail || undefined,
        productId: data.productId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Cupom criado com sucesso!");
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao criar cupom. Tente novamente.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Cupom</DialogTitle>
          <DialogDescription>
            Configure o código, tipo, desconto e regras do cupom.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Tipo */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Tipo do cupom <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200",
                        field.value === opt.value
                          ? opt.activeColor
                          : opt.color,
                      )}
                    >
                      <opt.icon className="h-5 w-5" />
                      <span className="text-[10px] sm:text-xs font-semibold">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.type && (
              <p className="text-destructive text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Código + Desconto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Código <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Ex: BEMVINDO10"
                className="uppercase"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-destructive text-sm">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercentage" className="text-sm font-medium">
                Desconto (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                min={1}
                max={99}
                placeholder="Ex: 10"
                {...register("discountPercentage", { valueAsNumber: true })}
              />
              {errors.discountPercentage && (
                <p className="text-destructive text-sm">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
          </div>

          {/* Valores limites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-sm font-medium">
                  Desconto máximo <span className="text-muted-foreground/60 font-normal">(opcional)</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Valor máximo de desconto que o cupom pode oferecer, mesmo que a porcentagem seja maior.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Controller
                name="maxDiscountAmount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v === 0 ? null : v)}
                    error={errors.maxDiscountAmount?.message}
                    placeholder="Ex: 50,00"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-sm font-medium">
                  Valor mínimo do carrinho <span className="text-muted-foreground/60 font-normal">(opcional)</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Valor mínimo que o carrinho deve ter para que o cupom seja aplicado.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Controller
                name="minCartValue"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v === 0 ? null : v)}
                    error={errors.minCartValue?.message}
                    placeholder="Ex: 100,00"
                  />
                )}
              />
            </div>
          </div>

          {/* Expiração + Limite de uso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Expiração{" "}
                <span className="text-muted-foreground/60 font-normal">(opcional)</span>
              </Label>
              <Controller
                name="expiresAt"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Selecione a data"
                  />
                )}
              />
              {errors.expiresAt && (
                <p className="text-destructive text-sm">
                  {errors.expiresAt.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit" className="text-sm font-medium">
                Limite de uso{" "}
                <span className="text-muted-foreground/60 font-normal">(opcional)</span>
              </Label>
              <Input
                id="usageLimit"
                type="number"
                min={1}
                placeholder="Ilimitado"
                {...register("usageLimit", { valueAsNumber: true })}
              />
              {errors.usageLimit && (
                <p className="text-destructive text-sm">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>
          </div>

          {/* Campos condicionais: Cliente / Produto */}
          {selectedType === "BY_CUSTOMER" && (
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-sm font-medium">
                E-mail do Cliente <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="cliente@email.com"
                {...register("customerEmail")}
              />
              {errors.customerEmail && (
                <p className="text-destructive text-sm">
                  {errors.customerEmail.message}
                </p>
              )}
            </div>
          )}

          {selectedType === "BY_PRODUCT" && (
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-sm font-medium">
                Produto <span className="text-destructive">*</span>
              </Label>
              {/* TODO: Substituir por select com carregamento dos produtos da API */}
              <Input
                id="productId"
                placeholder="ID do produto"
                {...register("productId")}
              />
              {errors.productId && (
                <p className="text-destructive text-sm">
                  {errors.productId.message}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="min-w-[140px] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              {createMutation.isPending ? "Criando..." : "Criar Cupom"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

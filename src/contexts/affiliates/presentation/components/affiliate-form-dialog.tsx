"use client";

import { useForm, useFieldArray, Controller, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Link as LinkIcon, FolderTree, Loader2, Mail, Tag } from "lucide-react";
import { Affiliate } from "../../domain/entities/affiliate";
import {
  createAffiliateSchema,
  updateAffiliateSchema,
  CreateAffiliateFormValues,
  CreateAffiliateFormInput,
  UpdateAffiliateFormValues,
} from "../schemas/affiliate.schema";
import { useCreateAffiliate } from "../hooks/use-create-affiliate";
import { useUpdateAffiliate } from "../hooks/use-update-affiliate";
import { useAffiliateCategories } from "@/contexts/affiliate-categories/presentation/hooks/use-affiliate-categories";
import { useCoupons } from "@/contexts/coupons/presentation/hooks/use-coupons";
import {
  maskPhone,
  maskCPF,
  unmaskPhone,
  unmaskCPF,
  formatPhone,
  formatCPF,
} from "@/shared/utils/masks";

type FormValues = CreateAffiliateFormValues | UpdateAffiliateFormValues;
type FormInput = CreateAffiliateFormInput | UpdateAffiliateFormValues;

interface AffiliateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate?: Affiliate | null;
}

function getErrorMessage(error: FieldError | undefined): string {
  if (!error) return "";
  if (typeof error.message === "string") return error.message;
  return "Valor inválido";
}

export function AffiliateFormDialog({
  open,
  onOpenChange,
  affiliate,
}: AffiliateFormDialogProps) {
  const isEditing = !!affiliate;
  const createMutation = useCreateAffiliate();
  const updateMutation = useUpdateAffiliate();
  const mutation = isEditing ? updateMutation : createMutation;

  const { data: categories, isLoading: isLoadingCategories } = useAffiliateCategories(true);
  const { data: couponsData, isLoading: isLoadingCoupons } = useCoupons(1, 1000);

  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [cpfDisplay, setCpfDisplay] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(isEditing ? updateAffiliateSchema : createAffiliateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      socialMedia: [],
      commissionRate: isEditing ? undefined : 0,
      categoryId: "",
      couponId: "",
    },
  });

  // @ts-ignore - react-hook-form useFieldArray has known TypeScript limitation with Zod inferred types
  const { fields, append, remove } = useFieldArray({ control, name: "socialMedia" });

  const selectedCouponId = watch("couponId" as keyof FormInput) as string | undefined;
  const selectedCoupon = couponsData?.coupons.find((c) => c.id === selectedCouponId);
  const originalCoupon = isEditing && affiliate
    ? couponsData?.coupons.find((c) => c.affiliateId === affiliate.id)
    : undefined;

  useEffect(() => {
    if (affiliate) {
      const phoneFormatted = affiliate.phone ? formatPhone(affiliate.phone) : "";
      const cpfFormatted = affiliate.cpf ? formatCPF(affiliate.cpf) : "";
      setPhoneDisplay(phoneFormatted);
      setCpfDisplay(cpfFormatted);
      const currentCoupon = couponsData?.coupons.find((c) => c.affiliateId === affiliate.id);
      reset({
        name: affiliate.name,
        email: affiliate.email,
        phone: phoneFormatted,
        cpf: cpfFormatted,
        socialMedia: affiliate.socialMedia || [],
        commissionRate: affiliate.commissionRate,
        categoryId: affiliate.categoryId || "",
        couponId: currentCoupon?.id || "",
      });
    } else {
      setPhoneDisplay("");
      setCpfDisplay("");
      reset({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        socialMedia: [],
        commissionRate: 0,
        categoryId: "",
        couponId: "",
      });
    }
  }, [affiliate, reset, couponsData]);

  const onSubmit = (data: FormValues) => {
    const couponId = (data as CreateAffiliateFormValues).couponId;
    const payload = {
      name: data.name,
      email: data.email,
      phone: unmaskPhone(data.phone ?? "") || undefined,
      cpf: unmaskCPF(data.cpf ?? "") || undefined,
      socialMedia:
        data.socialMedia && data.socialMedia.length > 0
          ? data.socialMedia
          : undefined,
      commissionRate: data.commissionRate,
      categoryId: data.categoryId || undefined,
      ...(couponId ? { couponId } : {}),
    };

    const onSuccess = () => {
      toast.success(
        isEditing
          ? "Afiliado atualizado com sucesso!"
          : "Afiliado criado com sucesso!"
      );
      reset();
      onOpenChange(false);
    };

    const onError = (error: Error) => {
      toast.error(
        error.message ||
          (isEditing
            ? "Erro ao atualizar afiliado. Tente novamente."
            : "Erro ao criar afiliado. Tente novamente.")
      );
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: affiliate!.id, data: payload },
        { onSuccess, onError }
      );
    } else {
      createMutation.mutate(
        payload as Parameters<typeof createMutation.mutate>[0],
        { onSuccess, onError }
      );
    }
  };

  const handleClose = () => {
    reset();
    setPhoneDisplay("");
    setCpfDisplay("");
    onOpenChange(false);
  };

  const availableCoupons = couponsData?.coupons ?? [];

  const activeCategories = categories?.filter((c) => c.isActive) ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {open && (
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing ? "Editar Afiliado" : "Cadastrar Afiliado"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os dados do afiliado."
                : "Preencha os dados do novo afiliado e defina sua taxa de comissão."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Nome e Email - lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="af-name" className="text-sm font-medium">
                  Nome completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="af-name"
                  placeholder="Ex: João Silva"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(errors.name)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="af-email" className="text-sm font-medium">
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="af-email"
                  type="email"
                  placeholder="Ex: joao@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(errors.email)}
                  </p>
                )}
              </div>
            </div>

            {/* Taxa de Comissão, Categoria e CPF - 3 colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr] gap-3">
              <div className="space-y-2">
                <Label htmlFor="af-commissionRate" className="text-sm font-medium">
                  Comissão (%) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="af-commissionRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ex: 5"
                  className="w-full"
                  {...register("commissionRate", { valueAsNumber: true })}
                />
                {errors.commissionRate && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(errors.commissionRate)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="af-categoryId" className="text-sm font-medium">
                  Categoria
                </Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                    >
                      <SelectTrigger id="af-categoryId" className="w-full">
                        {isLoadingCategories ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Carregando...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Selecione" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem categoria</SelectItem>
                        {activeCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <FolderTree className="h-4 w-4 text-muted-foreground" />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        {activeCategories.length === 0 && !isLoadingCategories && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Nenhuma categoria ativa
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(errors.categoryId)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="af-cpf" className="text-sm font-medium">
                  CPF
                </Label>
                <Input
                  id="af-cpf"
                  placeholder="Ex: 123.456.789-00"
                  className="w-full"
                  value={cpfDisplay}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    setCpfDisplay(masked);
                    register("cpf").onChange({
                      target: { value: masked, name: "cpf" },
                    });
                  }}
                  onBlur={() => {
                    register("cpf").onBlur({
                      target: { value: cpfDisplay, name: "cpf" },
                    });
                  }}
                />
                {errors.cpf && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(errors.cpf)}
                  </p>
                )}
              </div>
            </div>

            {/* Telefone - linha completa */}
            <div className="space-y-2">
              <Label htmlFor="af-phone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="af-phone"
                type="tel"
                placeholder="Ex: (11) 98765-4321"
                value={phoneDisplay}
                onChange={(e) => {
                  const masked = maskPhone(e.target.value);
                  setPhoneDisplay(masked);
                  register("phone").onChange({
                    target: { value: masked, name: "phone" },
                  });
                }}
                onBlur={() => {
                  register("phone").onBlur({
                    target: { value: phoneDisplay, name: "phone" },
                });
                }}
              />
              {errors.phone && (
                <p className="text-destructive text-sm">
                  {getErrorMessage(errors.phone)}
                </p>
              )}
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  Alterações na taxa só afetam comissões futuras.
                </p>
              )}
            </div>

            {/* Redes Sociais */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Redes Sociais{" "}
                  <span className="text-muted-foreground/60 font-normal">
                    (opcional)
                  </span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append("")}
                  className="gap-1 h-8 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="https://instagram.com/usuario"
                        className="pl-9"
                        {...register(`socialMedia.${index}`)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-10 w-10 shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma rede social adicionada
                  </p>
                )}
              </div>
              {errors.socialMedia && (
                <p className="text-destructive text-sm">
                  {typeof errors.socialMedia.message === "string"
                    ? errors.socialMedia.message
                    : "Verifique os campos de redes sociais"}
                </p>
              )}
            </div>

            {/* Cupom */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="af-couponId" className="text-sm font-medium">
                  Cupom{" "}
                  <span className="text-muted-foreground/60 font-normal">(opcional)</span>
                </Label>
              </div>
              <Controller
                name={"couponId" as keyof FormInput}
                control={control}
                render={({ field }) => (
                  <Select
                    value={(field.value as string) || "none"}
                    onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                  >
                    <SelectTrigger id="af-couponId" className="w-full">
                      {isLoadingCoupons ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Carregando cupons...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecione um cupom (opcional)" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem cupom</SelectItem>
                      {availableCoupons.map((coupon) => (
                        <SelectItem key={coupon.id} value={coupon.id}>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono font-medium">{coupon.code}</span>
                            <span className="text-muted-foreground text-xs">
                              ({coupon.discountPercentage}% off)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      {availableCoupons.length === 0 && !isLoadingCoupons && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Nenhum cupom disponível
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {selectedCoupon && !isEditing && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-50 p-2.5 text-sm text-amber-800 flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    O cupom <strong className="font-mono">{selectedCoupon.code}</strong> será vinculado ao afiliado e um <strong>email de boas-vindas</strong> com o código será enviado automaticamente.
                  </span>
                </div>
              )}
              {selectedCoupon && isEditing && selectedCoupon.id !== originalCoupon?.id && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-50 p-2.5 text-sm text-amber-800 flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    O cupom atual será substituído por <strong className="font-mono">{selectedCoupon.code}</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="min-w-[140px] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
              >
                {mutation.isPending
                  ? isEditing
                    ? "Salvando..."
                    : "Cadastrando..."
                  : isEditing
                    ? "Salvar Alterações"
                    : "Cadastrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Store,
  MapPin,
  Truck,
  CreditCard,
  Save,
  Loader2,
} from "lucide-react";
import { useStoreSettings } from "../hooks/use-store-settings";
import { useSaveStoreSettings } from "../hooks/use-save-store-settings";
import {
  storeSettingsSchema,
  StoreSettingsFormValues,
} from "../schemas/store-settings.schema";
import { maskPhone, maskDocument, formatPhone, formatDocument } from "@/shared/utils/masks";
import { apiFetch } from "@/shared/infrastructure/api/api-client";

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-0.5">{message}</p>;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 px-4 py-3">
        <Icon className="h-3.5 w-3.5 text-bee-gold shrink-0" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <Separator />
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function InstallmentPreview({ control }: { control: ReturnType<typeof useForm<StoreSettingsFormValues>>["control"] }) {
  const threshold = useWatch({ control, name: "paymentInterestFreeThreshold" });
  const below = useWatch({ control, name: "paymentInterestFreeInstallmentsBelow" });
  const above = useWatch({ control, name: "paymentInterestFreeInstallmentsAbove" });

  const t = Number(threshold) || 0;
  const b = Number(below) || 1;
  const a = Number(above) || 1;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  const exampleBelow = t > 0 ? t * 0.6 : 150;
  const exampleAbove = t > 0 ? t * 1.5 : 500;

  return (
    <div className="rounded-lg bg-muted/50 border border-dashed px-3 py-2.5 flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Exemplo com os valores acima</p>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
        <span className="text-xs text-muted-foreground min-w-0">
          Pedido de <span className="font-semibold text-foreground">{fmt(exampleBelow)}</span>{" "}
          <span className="whitespace-nowrap">(abaixo de {fmt(t)})</span>
        </span>
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">até {b}x sem juros</span>

        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        <span className="text-xs text-muted-foreground min-w-0">
          Pedido de <span className="font-semibold text-foreground">{fmt(exampleAbove)}</span>{" "}
          <span className="whitespace-nowrap">(acima de {fmt(t)})</span>
        </span>
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">até {a}x sem juros</span>
      </div>
    </div>
  );
}

export function StoreSettingsForm() {
  const { data: settings, isLoading } = useStoreSettings();
  const saveMutation = useSaveStoreSettings();
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      name: "",
      document: "",
      phone: "",
      email: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      freeShippingEnabled: false,
      freeShippingMinValue: 0,
      motoboyDeliveryEnabled: false,
      motoboyDeliveryPrice: 0,
      motoboyDeliveryTimeDays: 1,
      paymentMinInstallmentValue: 5,
      paymentInterestFreeThreshold: 0,
      paymentInterestFreeInstallmentsBelow: 1,
      paymentInterestFreeInstallmentsAbove: 1,
      paymentMaxInstallmentsLimit: 12,
      maxGiftsPerOrder: 0,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        name: settings.name,
        document: formatDocument(settings.document),
        phone: formatPhone(settings.phone),
        email: settings.email,
        zipCode: maskCep(settings.zipCode),
        address: settings.address ?? "",
        number: settings.number ?? "",
        complement: settings.complement ?? "",
        district: settings.district ?? "",
        city: settings.city,
        state: settings.state,
        freeShippingEnabled: settings.freeShippingEnabled,
        freeShippingMinValue: settings.freeShippingMinValue,
        motoboyDeliveryEnabled: settings.motoboyDeliveryEnabled,
        motoboyDeliveryPrice: settings.motoboyDeliveryPrice,
        motoboyDeliveryTimeDays: settings.motoboyDeliveryTimeDays,
        paymentMinInstallmentValue: settings.paymentMinInstallmentValue,
        paymentInterestFreeThreshold: settings.paymentInterestFreeThreshold,
        paymentInterestFreeInstallmentsBelow:
          settings.paymentInterestFreeInstallmentsBelow,
        paymentInterestFreeInstallmentsAbove:
          settings.paymentInterestFreeInstallmentsAbove,
        paymentMaxInstallmentsLimit: settings.paymentMaxInstallmentsLimit,
        maxGiftsPerOrder: settings.maxGiftsPerOrder,
      });
    }
  }, [settings, reset]);

  const handleCepChange = async (raw: string) => {
    const masked = maskCep(raw);
    setValue("zipCode", masked);
    const digits = masked.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setIsFetchingCep(true);
    try {
      const data = await apiFetch<{ street: string; neighborhood: string; city: string; state: string }>(
        `/address/zipcode/${digits}`
      );
      if (data.street) setValue("address", data.street);
      if (data.neighborhood) setValue("district", data.neighborhood);
      if (data.city) setValue("city", data.city);
      if (data.state) setValue("state", data.state.toUpperCase());
    } catch {
      // CEP não encontrado — usuário preenche manualmente
    } finally {
      setIsFetchingCep(false);
    }
  };

  const onSubmit = (values: StoreSettingsFormValues) => {
    const sanitized = {
      ...values,
      zipCode: values.zipCode.replace(/\D/g, ""),
      document: values.document.replace(/\D/g, ""),
      phone: values.phone.replace(/\D/g, ""),
    };
    saveMutation.mutate(
      { data: sanitized, exists: !!settings },
      {
        onSuccess: () => toast.success("Configurações salvas com sucesso!"),
        onError: () =>
          toast.error("Erro ao salvar configurações. Tente novamente."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pb-4">

      {/* Dados da Loja */}
      <Section icon={Store} title="Dados da Loja">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="name" className="text-xs">Nome</Label>
            <Input id="name" placeholder="ActionBee" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="document" className="text-xs">CNPJ / CPF</Label>
            <Input
              id="document"
              placeholder="00.000.000/0000-00"
              {...register("document")}
              onChange={(e) => setValue("document", maskDocument(e.target.value))}
            />
            <FieldError message={errors.document?.message} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              {...register("phone")}
              onChange={(e) => setValue("phone", maskPhone(e.target.value))}
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs">E-mail</Label>
            <Input id="email" type="email" placeholder="contato@loja.com" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
        </div>
      </Section>

      {/* Endereço */}
      <Section icon={MapPin} title="Endereço">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-6">
          {/* CEP */}
          <div className="col-span-1 sm:col-span-2 space-y-1">
            <Label htmlFor="zipCode" className="text-xs">CEP</Label>
            <div className="relative">
              <Input
                id="zipCode"
                placeholder="00000-000"
                maxLength={9}
                {...register("zipCode")}
                onChange={(e) => handleCepChange(e.target.value)}
                className={isFetchingCep ? "pr-8" : ""}
              />
              {isFetchingCep && (
                <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
            </div>
            <FieldError message={errors.zipCode?.message} />
          </div>
          {/* Logradouro */}
          <div className="col-span-1 sm:col-span-4 space-y-1">
            <Label htmlFor="address" className="text-xs">Logradouro</Label>
            <Input id="address" placeholder="Rua, Avenida..." {...register("address")} />
            <FieldError message={errors.address?.message} />
          </div>
          {/* Número */}
          <div className="space-y-1">
            <Label htmlFor="number" className="text-xs">Número</Label>
            <Input id="number" placeholder="123" {...register("number")} />
            <FieldError message={errors.number?.message} />
          </div>
          {/* Complemento */}
          <div className="space-y-1">
            <Label htmlFor="complement" className="text-xs">Complemento</Label>
            <Input id="complement" placeholder="Apto, Sala..." {...register("complement")} />
            <FieldError message={errors.complement?.message} />
          </div>
          {/* Bairro */}
          <div className="col-span-2 sm:col-span-2 space-y-1">
            <Label htmlFor="district" className="text-xs">Bairro</Label>
            <Input id="district" placeholder="Centro" {...register("district")} />
            <FieldError message={errors.district?.message} />
          </div>
          {/* Cidade */}
          <div className="col-span-2 sm:col-span-4 space-y-1">
            <Label htmlFor="city" className="text-xs">Cidade</Label>
            <Input id="city" placeholder="São Paulo" {...register("city")} />
            <FieldError message={errors.city?.message} />
          </div>
          {/* UF */}
          <div className="col-span-2 sm:col-span-2 space-y-1">
            <Label htmlFor="state" className="text-xs">UF</Label>
            <Input id="state" placeholder="SP" maxLength={2} className="uppercase" {...register("state")} />
            <FieldError message={errors.state?.message} />
          </div>
        </div>
      </Section>

      {/* Entrega */}
      <Section icon={Truck} title="Entrega">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Frete grátis</p>
              <p className="text-xs text-muted-foreground">Habilitar acima de um valor mínimo</p>
            </div>
            <Controller
              name="freeShippingEnabled"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="freeShippingMinValue" className="text-xs">Valor mínimo para frete grátis (R$)</Label>
            <Input
              id="freeShippingMinValue"
              type="number"
              min={0}
              step={0.01}
              placeholder="0,00"
              {...register("freeShippingMinValue", { valueAsNumber: true })}
            />
            <FieldError message={errors.freeShippingMinValue?.message} />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Entrega por motoboy</p>
              <p className="text-xs text-muted-foreground">Habilitar modalidade via motoboy</p>
            </div>
            <Controller
              name="motoboyDeliveryEnabled"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="motoboyDeliveryPrice" className="text-xs">Preço motoboy (R$)</Label>
              <Input
                id="motoboyDeliveryPrice"
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                {...register("motoboyDeliveryPrice", { valueAsNumber: true })}
              />
              <FieldError message={errors.motoboyDeliveryPrice?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="motoboyDeliveryTimeDays" className="text-xs">Prazo (dias)</Label>
              <Input
                id="motoboyDeliveryTimeDays"
                type="number"
                min={1}
                step={1}
                placeholder="1"
                {...register("motoboyDeliveryTimeDays", { valueAsNumber: true })}
              />
              <FieldError message={errors.motoboyDeliveryTimeDays?.message} />
            </div>
          </div>
        </div>
      </Section>

      {/* Parcelamento */}
      <Section icon={CreditCard} title="Parcelamento e Brindes">
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="paymentMinInstallmentValue" className="text-xs">Valor mín. por parcela (R$)</Label>
              <Input
                id="paymentMinInstallmentValue"
                type="number"
                min={0.01}
                step={0.01}
                placeholder="5,00"
                {...register("paymentMinInstallmentValue", { valueAsNumber: true })}
              />
              <FieldError message={errors.paymentMinInstallmentValue?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="paymentMaxInstallmentsLimit" className="text-xs">Máx. de parcelas</Label>
              <Input
                id="paymentMaxInstallmentsLimit"
                type="number"
                min={1}
                step={1}
                placeholder="12"
                {...register("paymentMaxInstallmentsLimit", { valueAsNumber: true })}
              />
              <FieldError message={errors.paymentMaxInstallmentsLimit?.message} />
            </div>
          </div>

          <Separator />

          {/* Regra de sem juros */}
          <div className="space-y-1">
            <p className="text-xs font-medium">Regra de parcelas sem juros</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Defina um valor de corte: pedidos <span className="font-medium text-foreground">abaixo</span> dele recebem menos parcelas sem juros, pedidos <span className="font-medium text-foreground">iguais ou acima</span> recebem mais.
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="paymentInterestFreeThreshold" className="text-xs">Valor de corte (R$)</Label>
            <Input
              id="paymentInterestFreeThreshold"
              type="number"
              min={0}
              step={0.01}
              placeholder="Ex: 300,00"
              {...register("paymentInterestFreeThreshold", { valueAsNumber: true })}
            />
            <FieldError message={errors.paymentInterestFreeThreshold?.message} />
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <div className="space-y-1">
              <Label htmlFor="paymentInterestFreeInstallmentsBelow" className="text-xs">
                Parcelas s/ juros — abaixo do corte
              </Label>
              <Input
                id="paymentInterestFreeInstallmentsBelow"
                type="number"
                min={1}
                step={1}
                placeholder="Ex: 3"
                {...register("paymentInterestFreeInstallmentsBelow", { valueAsNumber: true })}
              />
              <FieldError message={errors.paymentInterestFreeInstallmentsBelow?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="paymentInterestFreeInstallmentsAbove" className="text-xs">
                Parcelas s/ juros — acima do corte
              </Label>
              <Input
                id="paymentInterestFreeInstallmentsAbove"
                type="number"
                min={1}
                step={1}
                placeholder="Ex: 6"
                {...register("paymentInterestFreeInstallmentsAbove", { valueAsNumber: true })}
              />
              <FieldError message={errors.paymentInterestFreeInstallmentsAbove?.message} />
            </div>
          </div>
          <InstallmentPreview control={control} />

          <Separator />

          <div className="space-y-1">
            <Label htmlFor="maxGiftsPerOrder" className="text-xs">Máx. de brindes por pedido</Label>
            <Input
              id="maxGiftsPerOrder"
              type="number"
              min={0}
              step={1}
              placeholder="0"
              className="max-w-40"
              {...register("maxGiftsPerOrder", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">0 desabilita os brindes. Use 1 ou mais para permitir.</p>
            <FieldError message={errors.maxGiftsPerOrder?.message} />
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="h-9 bg-bee-gold text-black hover:bg-bee-amber min-w-32"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar configurações
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useFinancialSettings, useUpdateFinancialSettings } from "../hooks/use-financial-settings";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { useFinancialCategories } from "../hooks/use-financial-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

interface SettingsForm {
  creditCardSettlementDays: string;
  debitCardSettlementDays: string;
  pixSettlementDays: string;
  boletoSettlementDays: string;
  boletoAccountId: string;
  mercadoPagoAccountId: string;
  pixDirectAccountId: string;
  defaultOrderCategoryId: string;
}

const NONE = "__none__";

export function FinancialSettingsForm() {
  const { data: settings, isLoading } = useFinancialSettings();
  const { data: accounts = [] } = useFinancialAccounts();
  const { data: incomeCategories = [] } = useFinancialCategories("INCOME");
  const updateMutation = useUpdateFinancialSettings();

  const { register, handleSubmit, reset, control } = useForm<SettingsForm>({
    defaultValues: {
      creditCardSettlementDays: "30",
      debitCardSettlementDays: "1",
      pixSettlementDays: "1",
      boletoSettlementDays: "2",
      boletoAccountId: NONE,
      mercadoPagoAccountId: NONE,
      pixDirectAccountId: NONE,
      defaultOrderCategoryId: NONE,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        creditCardSettlementDays: String(settings.creditCardSettlementDays),
        debitCardSettlementDays: String(settings.debitCardSettlementDays),
        pixSettlementDays: String(settings.pixSettlementDays),
        boletoSettlementDays: String(settings.boletoSettlementDays),
        boletoAccountId: settings.boletoAccountId ?? NONE,
        mercadoPagoAccountId: settings.mercadoPagoAccountId ?? NONE,
        pixDirectAccountId: settings.pixDirectAccountId ?? NONE,
        defaultOrderCategoryId: settings.defaultOrderCategoryId ?? NONE,
      });
    }
  }, [settings, reset]);

  const onSubmit = (values: SettingsForm) => {
    updateMutation.mutate({
      creditCardSettlementDays: parseInt(values.creditCardSettlementDays),
      debitCardSettlementDays: parseInt(values.debitCardSettlementDays),
      pixSettlementDays: parseInt(values.pixSettlementDays),
      boletoSettlementDays: parseInt(values.boletoSettlementDays),
      boletoAccountId: values.boletoAccountId === NONE ? null : values.boletoAccountId,
      mercadoPagoAccountId: values.mercadoPagoAccountId === NONE ? null : values.mercadoPagoAccountId,
      pixDirectAccountId: values.pixDirectAccountId === NONE ? null : values.pixDirectAccountId,
      defaultOrderCategoryId: values.defaultOrderCategoryId === NONE ? null : values.defaultOrderCategoryId,
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 max-w-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      {/* Dias de liquidação */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold">Dias de liquidação por método de pagamento</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Define após quantos dias o valor cai na conta ao criar um recebível via venda.
        </p>

        <div className="space-y-2">
          <Label htmlFor="credit-days">Cartão de crédito (dias)</Label>
          <Input id="credit-days" type="number" min={0} max={365} {...register("creditCardSettlementDays")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="debit-days">Cartão de débito (dias)</Label>
          <Input id="debit-days" type="number" min={0} max={365} {...register("debitCardSettlementDays")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pix-days">PIX (dias)</Label>
          <Input id="pix-days" type="number" min={0} max={365} {...register("pixSettlementDays")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="boleto-days">Boleto (dias)</Label>
          <Input id="boleto-days" type="number" min={0} max={365} {...register("boletoSettlementDays")} />
        </div>
      </div>

      {/* Mapeamento de contas */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold">Contas por método de pagamento</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Define em qual conta financeira cada método de pagamento é lançado automaticamente.
        </p>

        <div className="space-y-2">
          <Label>Boleto (PagBank)</Label>
          <Controller
            name="boletoAccountId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhuma</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Cartão e PIX via gateway (MercadoPago)</Label>
          <Controller
            name="mercadoPagoAccountId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhuma</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>PIX direto (Itaú)</Label>
          <Controller
            name="pixDirectAccountId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhuma</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Categoria padrão */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold">Categoria padrão para vendas</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Categoria de receita usada nos lançamentos automáticos gerados por pedidos.
        </p>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <Controller
            name="defaultOrderCategoryId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhuma</SelectItem>
                  {incomeCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
        <Save className="h-4 w-4" />
        {updateMutation.isPending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}

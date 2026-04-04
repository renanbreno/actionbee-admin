"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { batchPayPayableSchema, type BatchPayPayableFormValues } from "../schemas/payable.schema";
import { useBatchPayPayables } from "../hooks/use-account-payables";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import type { AccountPayable } from "../../domain/entities/payable";
import { maskDate, unmaskDate, formatDate } from "@/shared/utils/masks";

interface Props {
  payables: AccountPayable[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function BatchPayPayableDialog({ payables, open, onOpenChange, onSuccess }: Props) {
  const batchPayMutation = useBatchPayPayables();
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BatchPayPayableFormValues>({
    resolver: zodResolver(batchPayPayableSchema),
    defaultValues: { paidAt: "", accountId: "" },
  });

  const accountValue = watch("accountId");

  useEffect(() => {
    if (open) {
      reset({ paidAt: formatDate(new Date()), accountId: "" });
    }
  }, [open, reset]);

  const totalAmount = payables.reduce((sum, p) => sum + p.amount, 0);

  const onSubmit = (values: BatchPayPayableFormValues) => {
    batchPayMutation.mutate(
      {
        ids: payables.map((p) => p.id),
        paidAt: unmaskDate(values.paidAt) ?? values.paidAt,
        accountId: values.accountId || undefined,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const activeAccounts = accounts.filter((a) => a.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Baixar em Lote</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{payables.length}</span> conta{payables.length !== 1 ? "s" : ""} selecionada{payables.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            Valor total: <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="batch-pay-date">Data de pagamento <span className="text-destructive">*</span></Label>
            <Input
              id="batch-pay-date"
              placeholder="dd/mm/aaaa"
              maxLength={10}
              {...register("paidAt", {
                onChange: (e) => setValue("paidAt", maskDate(e.target.value)),
              })}
            />
            {errors.paidAt && <p className="text-sm text-destructive">{errors.paidAt.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Conta <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Select value={accountValue ?? "_none"} onValueChange={(v) => setValue("accountId", v === "_none" ? undefined : v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar conta" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Nenhuma</SelectItem>
                {activeAccounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogActions isLoading={batchPayMutation.isPending} submitLabel="Confirmar Pagamentos" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

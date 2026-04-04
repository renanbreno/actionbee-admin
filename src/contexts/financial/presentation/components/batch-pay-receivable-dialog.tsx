"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { batchPayReceivableSchema, type BatchPayReceivableFormValues } from "../schemas/receivable.schema";
import { useBatchPayReceivables } from "../hooks/use-account-receivables";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { maskDate, unmaskDate, formatDate } from "@/shared/utils/masks";

interface Props {
  receivables: AccountReceivable[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function BatchPayReceivableDialog({ receivables, open, onOpenChange, onSuccess }: Props) {
  const batchPayMutation = useBatchPayReceivables();
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BatchPayReceivableFormValues>({
    resolver: zodResolver(batchPayReceivableSchema),
    defaultValues: { paidAt: "", accountId: "" },
  });

  const accountValue = watch("accountId");

  useEffect(() => {
    if (open) {
      reset({ paidAt: formatDate(new Date()), accountId: "" });
    }
  }, [open, reset]);

  const totalAmount = receivables.reduce((sum, r) => sum + r.amount, 0);

  const onSubmit = (values: BatchPayReceivableFormValues) => {
    batchPayMutation.mutate(
      {
        ids: receivables.map((r) => r.id),
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
            <span className="font-medium text-foreground">{receivables.length}</span> conta{receivables.length !== 1 ? "s" : ""} selecionada{receivables.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            Valor total: <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="batch-receive-date">Data de recebimento <span className="text-destructive">*</span></Label>
            <Input
              id="batch-receive-date"
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

          <DialogActions isLoading={batchPayMutation.isPending} submitLabel="Confirmar Recebimentos" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

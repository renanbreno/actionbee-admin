"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { payReceivableSchema, type PayReceivableFormValues } from "../schemas/receivable.schema";
import { usePayReceivable } from "../hooks/use-account-receivables";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import type { AccountReceivable } from "../../domain/entities/receivable";
import { maskDate, unmaskDate, formatDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";

interface Props {
  receivable: AccountReceivable | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PayReceivableDialog({ receivable, open, onOpenChange }: Props) {
  const payMutation = usePayReceivable();
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PayReceivableFormValues>({
    resolver: zodResolver(payReceivableSchema),
    defaultValues: { paidAt: "", paidAmount: "", accountId: "" },
  });

  const accountValue = watch("accountId");

  useEffect(() => {
    if (receivable && open) {
      const today = formatDate(new Date());
      reset({
        paidAt: today,
        paidAmount: maskCurrency(Math.round(receivable.amount * 100).toString()),
        accountId: receivable.accountId ?? "",
      });
    }
  }, [receivable, open, reset]);

  const onSubmit = (values: PayReceivableFormValues) => {
    if (!receivable) return;
    payMutation.mutate(
      {
        id: receivable.id,
        data: {
          paidAt: unmaskDate(values.paidAt) ?? values.paidAt,
          paidAmount: currencyToNumber(values.paidAmount),
          accountId: values.accountId || undefined,
        },
      },
      { onSuccess: () => { reset(); onOpenChange(false); } }
    );
  };

  const activeAccounts = accounts.filter((a) => a.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Recebimento</DialogTitle>
        </DialogHeader>
        {receivable && (
          <p className="text-sm text-muted-foreground -mt-2">{receivable.description}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pay-rec-date">Data de recebimento <span className="text-destructive">*</span></Label>
              <Input id="pay-rec-date" placeholder="dd/mm/aaaa" maxLength={10} {...register("paidAt", { onChange: (e) => setValue("paidAt", maskDate(e.target.value)) })} />
              {errors.paidAt && <p className="text-sm text-destructive">{errors.paidAt.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-rec-amount">Valor recebido <span className="text-destructive">*</span></Label>
              <Input id="pay-rec-amount" inputMode="numeric" placeholder="R$ 0,00" {...register("paidAmount", { onChange: (e) => setValue("paidAmount", maskCurrency(e.target.value)) })} />
              {errors.paidAmount && <p className="text-sm text-destructive">{errors.paidAmount.message}</p>}
            </div>
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

          <DialogActions isLoading={payMutation.isPending} submitLabel="Confirmar Recebimento" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

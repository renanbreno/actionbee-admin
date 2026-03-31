"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { payPayableSchema, type PayPayableFormValues } from "../schemas/payable.schema";
import { usePayPayable } from "../hooks/use-account-payables";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import type { AccountPayable } from "../../domain/entities/payable";
import { maskDate, unmaskDate, formatDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";

interface Props {
  payable: AccountPayable | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PayPayableDialog({ payable, open, onOpenChange }: Props) {
  const payMutation = usePayPayable();
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PayPayableFormValues>({
    resolver: zodResolver(payPayableSchema),
    defaultValues: { paidAt: "", paidAmount: "", accountId: "" },
  });

  const accountValue = watch("accountId");

  useEffect(() => {
    if (payable && open) {
      const today = formatDate(new Date());
      reset({
        paidAt: today,
        paidAmount: maskCurrency(Math.round(payable.amount * 100).toString()),
        accountId: payable.accountId ?? "",
      });
    }
  }, [payable, open, reset]);

  const onSubmit = (values: PayPayableFormValues) => {
    if (!payable) return;
    payMutation.mutate(
      {
        id: payable.id,
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
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        {payable && (
          <p className="text-sm text-muted-foreground -mt-2">{payable.description}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pay-pay-date">Data de pagamento <span className="text-destructive">*</span></Label>
              <Input id="pay-pay-date" placeholder="dd/mm/aaaa" maxLength={10} {...register("paidAt", { onChange: (e) => setValue("paidAt", maskDate(e.target.value)) })} />
              {errors.paidAt && <p className="text-sm text-destructive">{errors.paidAt.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-pay-amount">Valor pago <span className="text-destructive">*</span></Label>
              <Input id="pay-pay-amount" inputMode="numeric" placeholder="R$ 0,00" {...register("paidAmount", { onChange: (e) => setValue("paidAmount", maskCurrency(e.target.value)) })} />
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

          <DialogActions isLoading={payMutation.isPending} submitLabel="Confirmar Pagamento" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

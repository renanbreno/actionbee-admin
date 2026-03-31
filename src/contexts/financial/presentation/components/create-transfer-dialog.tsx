"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransferSchema, type CreateTransferFormValues } from "../schemas/transaction.schema";
import { useCreateTransfer } from "../hooks/use-financial-transactions";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { maskDate, unmaskDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateTransferDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateTransfer();
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: { amount: "", date: "", description: "Transferência entre contas", sourceAccountId: "", destinationAccountId: "" },
  });

  const sourceValue = watch("sourceAccountId");
  const destValue = watch("destinationAccountId");

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const onSubmit = (values: CreateTransferFormValues) => {
    createMutation.mutate(
      {
        amount: currencyToNumber(values.amount),
        date: unmaskDate(values.date) ?? values.date,
        description: values.description,
        sourceAccountId: values.sourceAccountId,
        destinationAccountId: values.destinationAccountId,
      },
      { onSuccess: () => { reset(); onOpenChange(false); } }
    );
  };

  const activeAccounts = accounts.filter((a) => a.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferência entre Contas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tf-amount">Valor <span className="text-destructive">*</span></Label>
              <Input id="tf-amount" inputMode="numeric" placeholder="R$ 0,00" {...register("amount", { onChange: (e) => setValue("amount", maskCurrency(e.target.value)) })} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tf-date">Data <span className="text-destructive">*</span></Label>
              <Input id="tf-date" placeholder="dd/mm/aaaa" maxLength={10} {...register("date", { onChange: (e) => setValue("date", maskDate(e.target.value)) })} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tf-desc">Descrição <span className="text-destructive">*</span></Label>
            <Input id="tf-desc" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Conta de origem <span className="text-destructive">*</span></Label>
            <Select value={sourceValue} onValueChange={(v) => setValue("sourceAccountId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar conta" /></SelectTrigger>
              <SelectContent>
                {activeAccounts.map((a) => (
                  <SelectItem key={a.id} value={a.id} disabled={a.id === destValue}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sourceAccountId && <p className="text-sm text-destructive">{errors.sourceAccountId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Conta de destino <span className="text-destructive">*</span></Label>
            <Select value={destValue} onValueChange={(v) => setValue("destinationAccountId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar conta" /></SelectTrigger>
              <SelectContent>
                {activeAccounts.map((a) => (
                  <SelectItem key={a.id} value={a.id} disabled={a.id === sourceValue}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinationAccountId && <p className="text-sm text-destructive">{errors.destinationAccountId.message}</p>}
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Transferir" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

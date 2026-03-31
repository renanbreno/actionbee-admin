"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createReceivableSchema, type CreateReceivableFormValues } from "../schemas/receivable.schema";
import { useCreateReceivable } from "../hooks/use-account-receivables";
import { useFinancialCategories } from "../hooks/use-financial-categories";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { maskDate, unmaskDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateReceivableDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateReceivable();
  const { data: categories = [] } = useFinancialCategories("INCOME");
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateReceivableFormValues>({
    resolver: zodResolver(createReceivableSchema),
    defaultValues: { description: "", amount: "", dueDate: "", categoryId: "", accountId: "", notes: "" },
  });

  const categoryValue = watch("categoryId");
  const accountValue = watch("accountId");

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const onSubmit = (values: CreateReceivableFormValues) => {
    createMutation.mutate(
      {
        description: values.description,
        amount: currencyToNumber(values.amount),
        dueDate: unmaskDate(values.dueDate) ?? values.dueDate,
        categoryId: values.categoryId,
        accountId: values.accountId || undefined,
        notes: values.notes || undefined,
      },
      { onSuccess: () => { reset(); onOpenChange(false); } }
    );
  };

  const activeAccounts = accounts.filter((a) => a.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta a Receber</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="rec-desc">Descrição <span className="text-destructive">*</span></Label>
            <Input id="rec-desc" placeholder="Ex: Venda de produto..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rec-amount">Valor <span className="text-destructive">*</span></Label>
              <Input id="rec-amount" inputMode="numeric" placeholder="R$ 0,00" {...register("amount", { onChange: (e) => setValue("amount", maskCurrency(e.target.value)) })} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rec-due">Vencimento <span className="text-destructive">*</span></Label>
              <Input id="rec-due" placeholder="dd/mm/aaaa" maxLength={10} {...register("dueDate", { onChange: (e) => setValue("dueDate", maskDate(e.target.value)) })} />
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria <span className="text-destructive">*</span></Label>
            <Select value={categoryValue} onValueChange={(v) => setValue("categoryId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
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

          <div className="space-y-2">
            <Label htmlFor="rec-notes">Observações <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Textarea id="rec-notes" rows={2} {...register("notes")} />
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Criar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

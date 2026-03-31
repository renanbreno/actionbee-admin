"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransactionSchema, type CreateTransactionFormValues } from "../schemas/transaction.schema";
import { useCreateTransaction } from "../hooks/use-financial-transactions";
import { useFinancialCategories } from "../hooks/use-financial-categories";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { maskDate, unmaskDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateTransactionDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateTransaction();
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: { type: "INCOME", amount: "", date: "", description: "", accountId: "", categoryId: "" },
  });

  const typeValue = watch("type");
  const accountValue = watch("accountId");
  const categoryValue = watch("categoryId");

  const { data: categories = [] } = useFinancialCategories(typeValue);

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const onSubmit = (values: CreateTransactionFormValues) => {
    createMutation.mutate(
      {
        type: values.type,
        amount: currencyToNumber(values.amount),
        date: unmaskDate(values.date) ?? values.date,
        description: values.description,
        accountId: values.accountId,
        categoryId: values.categoryId || undefined,
      },
      { onSuccess: () => { reset(); onOpenChange(false); } }
    );
  };

  const activeAccounts = accounts.filter((a) => a.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label>Tipo <span className="text-destructive">*</span></Label>
            <Select value={typeValue} onValueChange={(v) => { setValue("type", v as "INCOME" | "EXPENSE"); setValue("categoryId", ""); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Receita</SelectItem>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="txn-desc">Descrição <span className="text-destructive">*</span></Label>
            <Input id="txn-desc" placeholder="Ex: Venda avulsa, Pagamento..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="txn-amount">Valor <span className="text-destructive">*</span></Label>
              <Input id="txn-amount" inputMode="numeric" placeholder="R$ 0,00" {...register("amount", { onChange: (e) => setValue("amount", maskCurrency(e.target.value)) })} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-date">Data <span className="text-destructive">*</span></Label>
              <Input id="txn-date" placeholder="dd/mm/aaaa" maxLength={10} {...register("date", { onChange: (e) => setValue("date", maskDate(e.target.value)) })} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Conta <span className="text-destructive">*</span></Label>
            <Select value={accountValue} onValueChange={(v) => setValue("accountId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar conta" /></SelectTrigger>
              <SelectContent>
                {activeAccounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accountId && <p className="text-sm text-destructive">{errors.accountId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Categoria <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Select value={categoryValue ?? "_none"} onValueChange={(v) => setValue("categoryId", v === "_none" ? undefined : v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Nenhuma</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Criar Lançamento" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

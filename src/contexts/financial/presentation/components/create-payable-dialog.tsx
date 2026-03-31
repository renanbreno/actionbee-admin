"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPayableSchema, type CreatePayableFormValues } from "../schemas/payable.schema";
import { useCreatePayable } from "../hooks/use-account-payables";
import { useFinancialCategories } from "../hooks/use-financial-categories";
import { useFinancialAccounts } from "../hooks/use-financial-accounts";
import { SupplierSearch } from "./supplier-search";
import { maskDate, unmaskDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";
import type { Supplier } from "../../domain/entities/supplier";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreatePayableDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreatePayable();
  const { data: categories = [] } = useFinancialCategories("EXPENSE");
  const { data: accounts = [] } = useFinancialAccounts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreatePayableFormValues>({
    resolver: zodResolver(createPayableSchema),
    defaultValues: { description: "", amount: "", dueDate: "", categoryId: "", accountId: "", supplierId: "", notes: "" },
  });

  const categoryValue = watch("categoryId");
  const accountValue = watch("accountId");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedSupplier(null);
    }
  }, [open, reset]);

  const onSubmit = (values: CreatePayableFormValues) => {
    createMutation.mutate(
      {
        description: values.description,
        amount: currencyToNumber(values.amount),
        dueDate: unmaskDate(values.dueDate) ?? values.dueDate,
        categoryId: values.categoryId,
        accountId: values.accountId || undefined,
        supplierId: selectedSupplier?.id || undefined,
        notes: values.notes || undefined,
      },
      { onSuccess: () => { reset(); setSelectedSupplier(null); onOpenChange(false); } }
    );
  };

  const activeAccounts = accounts.filter((a) => a.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta a Pagar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="pay-desc">Descrição <span className="text-destructive">*</span></Label>
            <Input id="pay-desc" placeholder="Ex: Aluguel, Fornecedor..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pay-amount">Valor <span className="text-destructive">*</span></Label>
              <Input id="pay-amount" inputMode="numeric" placeholder="R$ 0,00" {...register("amount", { onChange: (e) => setValue("amount", maskCurrency(e.target.value)) })} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-due">Vencimento <span className="text-destructive">*</span></Label>
              <Input id="pay-due" placeholder="dd/mm/aaaa" maxLength={10} {...register("dueDate", { onChange: (e) => setValue("dueDate", maskDate(e.target.value)) })} />
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
            <Label>Fornecedor <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <SupplierSearch
              selected={selectedSupplier}
              onSelect={setSelectedSupplier}
              onClear={() => setSelectedSupplier(null)}
            />
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
            <Label htmlFor="pay-notes">Observações <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Textarea id="pay-notes" rows={2} {...register("notes")} />
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Criar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

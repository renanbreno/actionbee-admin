"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAccountSchema, type CreateAccountFormValues } from "../schemas/account.schema";
import { useCreateFinancialAccount } from "../hooks/use-financial-accounts";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateAccountDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateFinancialAccount();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: "", type: "BANK", initialBalance: "", bankName: "", agency: "", accountNumber: "" },
  });

  const typeValue = watch("type");

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const onSubmit = (values: CreateAccountFormValues) => {
    const initialBalance = values.initialBalance ? parseFloat(values.initialBalance.replace(",", ".")) : undefined;
    createMutation.mutate(
      { name: values.name, type: values.type, initialBalance, bankName: values.bankName || undefined, agency: values.agency || undefined, accountNumber: values.accountNumber || undefined },
      { onSuccess: () => { reset(); onOpenChange(false); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="acc-name">Nome <span className="text-destructive">*</span></Label>
            <Input id="acc-name" placeholder="Ex: Conta Corrente, Caixa..." {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tipo <span className="text-destructive">*</span></Label>
            <Select value={typeValue} onValueChange={(v) => setValue("type", v as "CASH" | "BANK")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK">Banco</SelectItem>
                <SelectItem value="CASH">Caixa</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="acc-balance">Saldo inicial <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Input id="acc-balance" placeholder="0,00" {...register("initialBalance")} />
          </div>

          {typeValue === "BANK" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="acc-bank">Banco</Label>
                <Input id="acc-bank" placeholder="Ex: Bradesco, Itaú..." {...register("bankName")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="acc-agency">Agência</Label>
                  <Input id="acc-agency" placeholder="0000" {...register("agency")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-number">Conta</Label>
                  <Input id="acc-number" placeholder="00000-0" {...register("accountNumber")} />
                </div>
              </div>
            </>
          )}

          <DialogActions isLoading={createMutation.isPending} submitLabel="Criar Conta" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

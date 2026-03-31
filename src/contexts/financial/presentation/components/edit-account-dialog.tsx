"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateAccountSchema, type UpdateAccountFormValues } from "../schemas/account.schema";
import { useUpdateFinancialAccount } from "../hooks/use-financial-accounts";
import type { FinancialAccount } from "../../domain/entities/account";

interface Props {
  account: FinancialAccount | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditAccountDialog({ account, open, onOpenChange }: Props) {
  const updateMutation = useUpdateFinancialAccount();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountSchema),
  });

  const activeValue = watch("active");

  useEffect(() => {
    if (account && open) {
      reset({ name: account.name, bankName: account.bankName ?? "", agency: account.agency ?? "", accountNumber: account.accountNumber ?? "", active: account.active });
    }
  }, [account, open, reset]);

  const onSubmit = (values: UpdateAccountFormValues) => {
    if (!account) return;
    updateMutation.mutate(
      { id: account.id, data: { name: values.name, bankName: values.bankName || undefined, agency: values.agency || undefined, accountNumber: values.accountNumber || undefined, active: values.active } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-acc-name">Nome <span className="text-destructive">*</span></Label>
            <Input id="edit-acc-name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {account?.type === "BANK" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-acc-bank">Banco</Label>
                <Input id="edit-acc-bank" {...register("bankName")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-acc-agency">Agência</Label>
                  <Input id="edit-acc-agency" {...register("agency")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-acc-number">Conta</Label>
                  <Input id="edit-acc-number" {...register("accountNumber")} />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Ativa</p>
              <p className="text-xs text-muted-foreground">Conta disponível para lançamentos</p>
            </div>
            <Switch checked={activeValue ?? true} onCheckedChange={(v) => setValue("active", v)} />
          </div>

          <DialogActions isLoading={updateMutation.isPending} submitLabel="Salvar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupplierSchema, type CreateSupplierFormValues } from "../schemas/supplier.schema";
import { useCreateSupplier } from "../hooks/use-suppliers";
import type { Supplier } from "../../domain/entities/supplier";
import { maskDocument, maskPhone, unmaskDocument, unmaskPhone } from "@/shared/utils/masks";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (supplier: Supplier) => void;
}

export function QuickCreateSupplierDialog({ open, onOpenChange, onSuccess }: Props) {
  const createMutation = useCreateSupplier();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateSupplierFormValues>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: { razaoSocial: "", cnpj: "", phone: "", email: "" },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (values: CreateSupplierFormValues) => {
    createMutation.mutate(
      {
        razaoSocial: values.razaoSocial,
        cnpj: values.cnpj ? unmaskDocument(values.cnpj) : undefined,
        phone: values.phone ? unmaskPhone(values.phone) : undefined,
        email: values.email || undefined,
      },
      {
        onSuccess: (supplier) => {
          reset();
          onOpenChange(false);
          onSuccess(supplier);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="q-razao">Razão Social <span className="text-destructive">*</span></Label>
            <Input id="q-razao" placeholder="Razão social" {...register("razaoSocial")} />
            {errors.razaoSocial && <p className="text-sm text-destructive">{errors.razaoSocial.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-cnpj">CNPJ</Label>
            <Input
              id="q-cnpj"
              placeholder="00.000.000/0000-00"
              maxLength={18}
              {...register("cnpj", { onChange: (e) => setValue("cnpj", maskDocument(e.target.value)) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="q-email">E-mail</Label>
              <Input id="q-email" placeholder="email@exemplo.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-phone">Telefone</Label>
              <Input
                id="q-phone"
                placeholder="(00) 00000-0000"
                maxLength={15}
                {...register("phone", { onChange: (e) => setValue("phone", maskPhone(e.target.value)) })}
              />
            </div>
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Cadastrar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

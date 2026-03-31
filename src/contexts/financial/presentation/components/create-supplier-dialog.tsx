"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSupplierSchema, type CreateSupplierFormValues } from "../schemas/supplier.schema";
import { useCreateSupplier } from "../hooks/use-suppliers";
import { maskDocument, maskPhone, unmaskDocument, unmaskPhone } from "@/shared/utils/masks";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateSupplierDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateSupplier();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateSupplierFormValues>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      inscricaoEstadual: "",
      email: "",
      phone: "",
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (values: CreateSupplierFormValues) => {
    createMutation.mutate(
      {
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia || undefined,
        cnpj: values.cnpj ? unmaskDocument(values.cnpj) : undefined,
        inscricaoEstadual: values.inscricaoEstadual || undefined,
        email: values.email || undefined,
        phone: values.phone ? unmaskPhone(values.phone) : undefined,
        street: values.street || undefined,
        number: values.number || undefined,
        complement: values.complement || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        zipCode: values.zipCode || undefined,
        country: values.country || undefined,
        notes: values.notes || undefined,
      },
      { onSuccess: () => { reset(); onOpenChange(false); } },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="sup-razao">Razão Social <span className="text-destructive">*</span></Label>
            <Input id="sup-razao" placeholder="Razão social" {...register("razaoSocial")} />
            {errors.razaoSocial && <p className="text-sm text-destructive">{errors.razaoSocial.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sup-fantasia">Nome Fantasia</Label>
            <Input id="sup-fantasia" placeholder="Nome fantasia" {...register("nomeFantasia")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sup-cnpj">CNPJ</Label>
              <Input
                id="sup-cnpj"
                placeholder="00.000.000/0000-00"
                maxLength={18}
                {...register("cnpj", { onChange: (e) => setValue("cnpj", maskDocument(e.target.value)) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-ie">Inscrição Estadual</Label>
              <Input id="sup-ie" placeholder="Inscrição estadual" {...register("inscricaoEstadual")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sup-email">E-mail</Label>
              <Input id="sup-email" placeholder="email@exemplo.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-phone">Telefone</Label>
              <Input
                id="sup-phone"
                placeholder="(00) 00000-0000"
                maxLength={15}
                {...register("phone", { onChange: (e) => setValue("phone", maskPhone(e.target.value)) })}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sup-cep">CEP</Label>
            <Input id="sup-cep" placeholder="CEP" {...register("zipCode")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sup-street">Rua</Label>
            <Input id="sup-street" placeholder="Rua" {...register("street")} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sup-num">Número</Label>
              <Input id="sup-num" placeholder="Nº" {...register("number")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="sup-comp">Complemento</Label>
              <Input id="sup-comp" placeholder="Complemento" {...register("complement")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="sup-city">Cidade</Label>
              <Input id="sup-city" placeholder="Cidade" {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-state">UF</Label>
              <Input id="sup-state" placeholder="UF" maxLength={2} {...register("state")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sup-country">País</Label>
            <Input id="sup-country" placeholder="País" {...register("country")} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sup-notes">Observações</Label>
            <Textarea id="sup-notes" rows={2} {...register("notes")} />
          </div>

          <DialogActions isLoading={createMutation.isPending} submitLabel="Criar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

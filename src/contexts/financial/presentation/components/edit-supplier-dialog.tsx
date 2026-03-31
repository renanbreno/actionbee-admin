"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSupplierSchema, type CreateSupplierFormValues } from "../schemas/supplier.schema";
import { useUpdateSupplier } from "../hooks/use-suppliers";
import type { Supplier } from "../../domain/entities/supplier";
import { maskDocument, maskPhone, formatCNPJ, formatPhone, unmaskDocument, unmaskPhone } from "@/shared/utils/masks";
import { Separator } from "@/components/ui/separator";

interface Props {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditSupplierDialog({ supplier, open, onOpenChange }: Props) {
  const updateMutation = useUpdateSupplier();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateSupplierFormValues>({
    resolver: zodResolver(createSupplierSchema),
  });

  useEffect(() => {
    if (supplier && open) {
      reset({
        razaoSocial: supplier.razaoSocial ?? "",
        nomeFantasia: supplier.nomeFantasia ?? "",
        cnpj: supplier.cnpj ? formatCNPJ(supplier.cnpj) : "",
        inscricaoEstadual: supplier.inscricaoEstadual ?? "",
        email: supplier.email ?? "",
        phone: supplier.phone ? formatPhone(supplier.phone) : "",
        street: supplier.street ?? "",
        number: supplier.number ?? "",
        complement: supplier.complement ?? "",
        city: supplier.city ?? "",
        state: supplier.state ?? "",
        zipCode: supplier.zipCode ?? "",
        country: supplier.country ?? "",
        notes: supplier.notes ?? "",
      });
    }
  }, [supplier, open, reset]);

  const onSubmit = (values: CreateSupplierFormValues) => {
    if (!supplier) return;
    updateMutation.mutate(
      {
        id: supplier.id,
        data: {
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
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-razao">Razão Social <span className="text-destructive">*</span></Label>
            <Input id="edit-razao" placeholder="Razão social" {...register("razaoSocial")} />
            {errors.razaoSocial && <p className="text-sm text-destructive">{errors.razaoSocial.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fantasia">Nome Fantasia</Label>
            <Input id="edit-fantasia" placeholder="Nome fantasia" {...register("nomeFantasia")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-cnpj">CNPJ</Label>
              <Input
                id="edit-cnpj"
                placeholder="00.000.000/0000-00"
                maxLength={18}
                {...register("cnpj", { onChange: (e) => setValue("cnpj", maskDocument(e.target.value)) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ie">Inscrição Estadual</Label>
              <Input id="edit-ie" placeholder="Inscrição estadual" {...register("inscricaoEstadual")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input id="edit-email" placeholder="email@exemplo.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                placeholder="(00) 00000-0000"
                maxLength={15}
                {...register("phone", { onChange: (e) => setValue("phone", maskPhone(e.target.value)) })}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="edit-cep">CEP</Label>
            <Input id="edit-cep" placeholder="CEP" {...register("zipCode")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-street">Rua</Label>
            <Input id="edit-street" placeholder="Rua" {...register("street")} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-num">Número</Label>
              <Input id="edit-num" placeholder="Nº" {...register("number")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-comp">Complemento</Label>
              <Input id="edit-comp" placeholder="Complemento" {...register("complement")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-city">Cidade</Label>
              <Input id="edit-city" placeholder="Cidade" {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-state">UF</Label>
              <Input id="edit-state" placeholder="UF" maxLength={2} {...register("state")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-country">País</Label>
            <Input id="edit-country" placeholder="País" {...register("country")} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Observações</Label>
            <Textarea id="edit-notes" rows={2} {...register("notes")} />
          </div>

          <DialogActions isLoading={updateMutation.isPending} submitLabel="Salvar" onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

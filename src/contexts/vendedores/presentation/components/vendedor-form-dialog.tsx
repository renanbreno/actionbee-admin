"use client";

import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vendedor } from "../../domain/entities/vendedor";
import {
  createVendedorSchema,
  updateVendedorSchema,
  CreateVendedorFormValues,
  UpdateVendedorFormValues,
} from "../schemas/vendedor.schema";
import { useCreateVendedor } from "../hooks/use-create-vendedor";
import { useUpdateVendedor } from "../hooks/use-update-vendedor";
import { maskPhone, unmaskPhone, formatPhone, maskCPF, formatCPF } from "@/shared/utils/masks";

type FormValues = CreateVendedorFormValues | UpdateVendedorFormValues;

interface VendedorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendedor?: Vendedor | null;
}

function getErrorMessage(error: FieldError | undefined): string {
  if (!error) return "";
  if (typeof error.message === "string") return error.message;
  return "Valor inválido";
}

export function VendedorFormDialog({
  open,
  onOpenChange,
  vendedor,
}: VendedorFormDialogProps) {
  const isEditing = !!vendedor;
  const createMutation = useCreateVendedor();
  const updateMutation = useUpdateVendedor();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateVendedorSchema : createVendedorSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", cpf: "", phone: "", birthDate: "", commissionRate: undefined },
  });

  useEffect(() => {
    if (vendedor) {
      const phone = vendedor.phone ? formatPhone(vendedor.phone) : "";
      const cpf = vendedor.cpf ? formatCPF(vendedor.cpf) : "";
      const birthDate = vendedor.birthDate ? vendedor.birthDate.substring(0, 10) : "";
      reset({
        name: vendedor.name,
        email: vendedor.email,
        cpf,
        phone,
        birthDate,
        commissionRate: vendedor.commissionRate,
      });
    } else {
      reset({ name: "", email: "", cpf: "", phone: "", birthDate: "", commissionRate: undefined });
    }
  }, [vendedor, reset]);

  const onSubmit = (data: FormValues) => {
    const cpfDigits = data.cpf ? data.cpf.replace(/\D/g, "") : undefined;

    const payload = {
      name: data.name,
      email: data.email,
      cpf: cpfDigits || undefined,
      phone: data.phone ? unmaskPhone(data.phone) : undefined,
      birthDate: data.birthDate || undefined,
      ...(data.commissionRate !== undefined && { commissionRate: data.commissionRate }),
    };

    const onSuccess = () => {
      toast.success(isEditing ? "Vendedor atualizado!" : "Vendedor cadastrado!");
      reset();
      onOpenChange(false);
    };

    const onError = (error: Error) => {
      toast.error(error.message || (isEditing ? "Erro ao atualizar." : "Erro ao cadastrar."));
    };

    if (isEditing) {
      updateMutation.mutate({ id: vendedor!.id, data: payload }, { onSuccess, onError });
    } else {
      createMutation.mutate(
        payload as Parameters<typeof createMutation.mutate>[0],
        { onSuccess, onError }
      );
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {open && (
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing ? "Editar Vendedor" : "Cadastrar Vendedor"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os dados do vendedor."
                : "Preencha os dados do novo vendedor."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="vend-name" className="text-sm font-medium">
                Nome completo <span className="text-destructive">*</span>
              </Label>
              <Input id="vend-name" placeholder="Ex: João Silva" {...register("name")} />
              {errors.name && (
                <p className="text-destructive text-sm">{getErrorMessage(errors.name as FieldError)}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="vend-email" className="text-sm font-medium">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vend-email"
                type="email"
                placeholder="Ex: joao@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{getErrorMessage(errors.email as FieldError)}</p>
              )}
            </div>

            {/* Telefone e CPF lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="vend-phone" className="text-sm font-medium">
                  Telefone
                </Label>
                <Input
                  id="vend-phone"
                  type="tel"
                  placeholder="Ex: (11) 98765-4321"
                  {...register("phone")}
                  onChange={(e) => setValue("phone", maskPhone(e.target.value))}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.phone as FieldError)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vend-cpf" className="text-sm font-medium">
                  CPF
                </Label>
                <Input
                  id="vend-cpf"
                  placeholder="123.456.789-00"
                  {...register("cpf")}
                  onChange={(e) => setValue("cpf", maskCPF(e.target.value))}
                />
                {errors.cpf && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.cpf as FieldError)}</p>
                )}
              </div>
            </div>

            {/* Data de nascimento e Comissão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="vend-birthdate" className="text-sm font-medium">
                  Data de Nascimento
                </Label>
                <Input
                  id="vend-birthdate"
                  type="date"
                  {...register("birthDate")}
                />
                {errors.birthDate && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.birthDate as FieldError)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vend-commission" className="text-sm font-medium">
                  Taxa de Comissão (%)
                </Label>
                <Input
                  id="vend-commission"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ex: 10"
                  {...register("commissionRate", { valueAsNumber: true })}
                />
                {errors.commissionRate && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.commissionRate as FieldError)}</p>
                )}
              </div>
            </div>

            <DialogActions
              isLoading={mutation.isPending}
              loadingText={isEditing ? "Salvando..." : "Cadastrando..."}
              submitLabel={isEditing ? "Salvar Alterações" : "Cadastrar"}
              onCancel={handleClose}
              submitButtonProps={{
                className:
                  "min-w-[140px] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]",
              }}
            />
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

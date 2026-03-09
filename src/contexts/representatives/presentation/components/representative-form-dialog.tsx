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
import { FileText } from "lucide-react";
import { Representative } from "../../domain/entities/representative";
import {
  createRepresentativeSchema,
  updateRepresentativeSchema,
  CreateRepresentativeFormValues,
  UpdateRepresentativeFormValues,
} from "../schemas/representative.schema";
import { useCreateRepresentative } from "../hooks/use-create-representative";
import { useUpdateRepresentative } from "../hooks/use-update-representative";
import {
  maskPhone,
  unmaskPhone,
  formatPhone,
  maskDocument,
  formatDocument,
  unmaskDocument,
  getDocumentType,
} from "@/shared/utils/masks";

type FormValues = CreateRepresentativeFormValues | UpdateRepresentativeFormValues;

interface RepresentativeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  representative?: Representative | null;
}

function getErrorMessage(error: FieldError | undefined): string {
  if (!error) return "";
  if (typeof error.message === "string") return error.message;
  return "Valor inválido";
}

export function RepresentativeFormDialog({
  open,
  onOpenChange,
  representative,
}: RepresentativeFormDialogProps) {
  const isEditing = !!representative;
  const createMutation = useCreateRepresentative();
  const updateMutation = useUpdateRepresentative();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateRepresentativeSchema : createRepresentativeSchema),
    defaultValues: { name: "", email: "", phone: "", document: "", commissionRate: undefined },
  });

  const documentValue = watch("document") || "";
  const documentType = getDocumentType(documentValue);

  useEffect(() => {
    if (representative) {
      const phone = representative.phone ? formatPhone(representative.phone) : "";
      const doc = representative.cnpj
        ? formatDocument(representative.cnpj)
        : representative.cpf
        ? formatDocument(representative.cpf)
        : "";
      reset({
        name: representative.name,
        email: representative.email,
        phone,
        document: doc,
        commissionRate: representative.commissionRate,
      });
    } else {
      reset({ name: "", email: "", phone: "", document: "", commissionRate: undefined });
    }
  }, [representative, reset]);

  const onSubmit = (data: FormValues) => {
    const docDigits = unmaskDocument(data.document ?? "");
    const docType = getDocumentType(data.document ?? "");

    const payload = {
      name: data.name,
      email: data.email,
      phone: unmaskPhone((data as CreateRepresentativeFormValues).phone ?? "") || undefined,
      cpf: docType === "cpf" ? docDigits : undefined,
      cnpj: docType === "cnpj" ? docDigits : undefined,
      ...(data.commissionRate !== undefined && { commissionRate: data.commissionRate }),
    };

    const onSuccess = () => {
      toast.success(isEditing ? "Representante atualizado!" : "Representante cadastrado!");
      reset();
      onOpenChange(false);
    };

    const onError = (error: Error) => {
      toast.error(error.message || (isEditing ? "Erro ao atualizar." : "Erro ao cadastrar."));
    };

    if (isEditing) {
      updateMutation.mutate({ id: representative!.id, data: payload }, { onSuccess, onError });
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
              {isEditing ? "Editar Representante" : "Cadastrar Representante"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os dados do representante."
                : "Preencha os dados do novo representante."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="rep-name" className="text-sm font-medium">
                Nome completo <span className="text-destructive">*</span>
              </Label>
              <Input id="rep-name" placeholder="Ex: João Silva" {...register("name")} />
              {errors.name && (
                <p className="text-destructive text-sm">{getErrorMessage(errors.name as FieldError)}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="rep-email" className="text-sm font-medium">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rep-email"
                type="email"
                placeholder="Ex: joao@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{getErrorMessage(errors.email as FieldError)}</p>
              )}
            </div>

            {/* Telefone e CPF/CNPJ lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="rep-phone" className="text-sm font-medium">
                  Telefone {!isEditing && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="rep-phone"
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
                <Label htmlFor="rep-document" className="text-sm font-medium">
                  {documentType === "cnpj" ? "CNPJ" : "CPF"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="rep-document"
                    placeholder={documentType === "cnpj" ? "12.345.678/0001-90" : "123.456.789-00"}
                    className="pl-9"
                    {...register("document")}
                    onChange={(e) => setValue("document", maskDocument(e.target.value))}
                  />
                </div>
                {errors.document && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.document as FieldError)}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {documentType === "cnpj" ? "Formatando como CNPJ" : "Digite +11 dígitos para CNPJ"}
                </p>
              </div>
            </div>

            {/* Taxa de Comissão */}
            <div className="space-y-2">
              <Label htmlFor="rep-commission" className="text-sm font-medium">
                Taxa de Comissão (%)
              </Label>
              <Input
                id="rep-commission"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Ex: 10"
                {...register("commissionRate", { valueAsNumber: true })}
                className="max-w-[200px]"
              />
              {errors.commissionRate && (
                <p className="text-destructive text-sm">{getErrorMessage(errors.commissionRate as FieldError)}</p>
              )}
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

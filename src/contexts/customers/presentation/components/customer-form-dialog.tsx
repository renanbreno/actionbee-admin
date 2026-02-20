"use client";

import React, { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Mail, User, Phone, MapPin, FileText } from "lucide-react";
import { Customer } from "../../domain/entities/customer";
import {
  createCustomerSchema,
  updateCustomerSchema,
  CreateCustomerFormValues,
  UpdateCustomerFormValues,
} from "../schemas/customer.schema";
import { useCreateCustomer } from "../hooks/use-create-customer";
import { useUpdateCustomer } from "../hooks/use-update-customer";
import { useCustomerDetails } from "../hooks/use-customer-details";
import { maskPhone, unmaskPhone, formatPhone, maskDocument, formatDocument, unmaskDocument, getDocumentType } from "@/shared/utils/masks";
import { apiFetch } from "@/shared/infrastructure/api/api-client";

type FormValues = CreateCustomerFormValues | UpdateCustomerFormValues;

interface ZipCodeResponse {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}

function getErrorMessage(error: FieldError | undefined): string {
  if (!error) return "";
  if (typeof error.message === "string") return error.message;
  return "Valor inválido";
}

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
}: CustomerFormDialogProps) {
  const isEditing = !!customer;
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const mutation = isEditing ? updateMutation : createMutation;

  const [isFetchingCep, setIsFetchingCep] = useState(false);

  // Busca os detalhes completos do cliente ao abrir para edição
  const { data: customerDetails, isLoading: isLoadingDetails } = useCustomerDetails(
    isEditing ? customer?.id ?? null : null
  );

  // Usa os detalhes completos se estiver editando, senão o customer básico
  const fullCustomer = isEditing ? customerDetails : customer;

  // Deriva o valor inicial do phone formatado
  const initialPhone = useMemo(() => {
    return fullCustomer?.phone ? formatPhone(fullCustomer.phone) : "";
  }, [fullCustomer]);

  // Deriva o valor inicial do documento (CPF ou CNPJ) formatado
  const initialDocument = useMemo(() => {
    if (fullCustomer?.cnpj) return formatDocument(fullCustomer.cnpj);
    if (fullCustomer?.cpf) return formatDocument(fullCustomer.cpf);
    return "";
  }, [fullCustomer]);

  // Deriva o valor inicial do isFinalConsumer
  const initialIsFinalConsumer = useMemo(() => {
    return fullCustomer?.isFinalConsumer ?? true;
  }, [fullCustomer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
      resolver: zodResolver(isEditing ? updateCustomerSchema : createCustomerSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        document: "",
        isFinalConsumer: true,
        address: undefined,
      },
    });

  // Observa o documento para detectar se é CPF ou CNPJ
  const documentValue = watch("document") || "";
  const documentType = getDocumentType(documentValue);

  // Atualiza o formulário quando os detalhes são carregados
  React.useEffect(() => {
    if (fullCustomer) {
      reset({
        name: fullCustomer.name ?? "",
        email: fullCustomer.email ?? "",
        phone: initialPhone,
        document: initialDocument,
        isFinalConsumer: initialIsFinalConsumer,
        address: fullCustomer.address ?? undefined,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        document: "",
        isFinalConsumer: true,
        address: undefined,
      });
    }
  }, [fullCustomer, initialPhone, initialDocument, initialIsFinalConsumer, reset]);

  const showAddress = watch("address") !== undefined;

  const handleCepChange = async (raw: string) => {
    const masked = maskCep(raw);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("address.zipCode" as any, masked);

    const digits = masked.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setIsFetchingCep(true);
    try {
      const data = await apiFetch<ZipCodeResponse>(`/address/zipcode/${digits}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("address.street" as any, data.street);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("address.neighborhood" as any, data.neighborhood);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("address.city" as any, data.city);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("address.state" as any, data.state);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("address.country" as any, data.country);
    } catch {
      toast.error("CEP não encontrado. Preencha o endereço manualmente.");
    } finally {
      setIsFetchingCep(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    // Determina se é CPF ou CNPJ baseado na quantidade de dígitos
    const documentDigits = unmaskDocument(data.document ?? "");
    const docType = getDocumentType(data.document ?? "");

    const payload = {
      name: data.name,
      email: data.email,
      phone: unmaskPhone(data.phone ?? "") || undefined,
      cpf: docType === "cpf" ? documentDigits : undefined,
      cnpj: docType === "cnpj" ? documentDigits : undefined,
      isFinalConsumer: data.isFinalConsumer ?? true,
      ...(showAddress && data.address && { address: data.address }),
    };

    const onSuccess = () => {
      toast.success(
        isEditing
          ? "Cliente atualizado com sucesso!"
          : "Cliente criado com sucesso!"
      );
      onOpenChange(false);
    };

    const onError = (error: Error) => {
      toast.error(
        error.message ||
          (isEditing
            ? "Erro ao atualizar cliente. Tente novamente."
            : "Erro ao criar cliente. Tente novamente.")
      );
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: customer!.id, data: payload },
        { onSuccess, onError }
      );
    } else {
      createMutation.mutate(
        payload as Parameters<typeof createMutation.mutate>[0],
        { onSuccess, onError }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) reset();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Editar Cliente" : "Cadastrar Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do cliente."
              : "Preencha os dados do novo cliente."}
          </DialogDescription>
        </DialogHeader>

        {isEditing && isLoadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
            {/* Nome e Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cust-name" className="text-sm font-medium">
                  Nome completo <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cust-name"
                    placeholder="Ex: João Silva"
                    className="pl-9"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.name)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cust-email" className="text-sm font-medium">
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cust-email"
                    type="email"
                    placeholder="Ex: joao@email.com"
                    className="pl-9"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.email)}</p>
                )}
              </div>
            </div>

            {/* Telefone, CPF/CNPJ e Tipo de cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="cust-phone" className="text-sm font-medium">
                  Telefone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="cust-phone"
                    type="tel"
                    placeholder="Ex: (11) 98765-4321"
                    className="pl-9"
                    {...register("phone")}
                    onChange={(e) => {
                      const masked = maskPhone(e.target.value);
                      setValue("phone", masked);
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.phone)}</p>
                )}
              </div>

              {/* CPF/CNPJ */}
              <div className="space-y-2">
                <Label htmlFor="cust-document" className="text-sm font-medium">
                  {documentType === "cnpj" ? "CNPJ" : "CPF"} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="cust-document"
                    placeholder={documentType === "cnpj" ? "Ex: 12.345.678/0001-90" : "Ex: 123.456.789-00"}
                    className="pl-9"
                    {...register("document")}
                    onChange={(e) => {
                      const masked = maskDocument(e.target.value);
                      setValue("document", masked);
                    }}
                  />
                </div>
                {errors.document && (
                  <p className="text-destructive text-sm">{getErrorMessage(errors.document)}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {documentType === "cnpj"
                    ? "Digite mais dígitos para CNPJ"
                    : "Digite +11 dígitos para CNPJ"}
                </p>
              </div>

              {/* Tipo de cliente - toggle compacto */}
              <div className="space-y-2">
                <Label htmlFor="cust-isFinalConsumer" className="text-sm font-medium">
                  Tipo
                </Label>
                <div className="flex items-center gap-3 h-10 px-3 py-2 border rounded-md bg-background sm:h-[42px]">
                  <Switch
                    id="cust-isFinalConsumer"
                    checked={watch("isFinalConsumer") ?? true}
                    onCheckedChange={(checked) => setValue("isFinalConsumer", checked)}
                  />
                  <span className="text-sm">
                    {watch("isFinalConsumer") ?? true ? "Consumidor final" : "Revendedor"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {watch("isFinalConsumer") ?? true
                    ? "Consumo próprio"
                    : "Para revenda"}
                </p>
              </div>
            </div>

            {/* Endereço toggle */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label htmlFor="show-address" className="text-sm font-medium">
                  Adicionar endereço
                </Label>
                <p className="text-xs text-muted-foreground">
                  {showAddress ? "Preencha os dados do endereço" : "O cliente não possui endereço cadastrado"}
                </p>
              </div>
              <Switch
                id="show-address"
                checked={showAddress}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue("address", {
                      street: "",
                      number: "",
                      neighborhood: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      country: "",
                    });
                  } else {
                    setValue("address", undefined);
                  }
                }}
              />
            </div>

            {/* Endereço */}
            {showAddress && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Endereço</span>
                </div>

                {/* CEP — primeiro campo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="addr-zipCode" className="text-xs">
                      CEP <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="addr-zipCode"
                        placeholder="00000-000"
                        {...register("address.zipCode")}
                        onChange={(e) => handleCepChange(e.target.value)}
                        className={isFetchingCep ? "pr-9" : ""}
                      />
                      {isFetchingCep && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    {errors.address?.zipCode && (
                      <p className="text-destructive text-xs">{errors.address.zipCode.message}</p>
                    )}
                  </div>
                </div>

                {/* Rua, Número e Complemento */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="addr-street" className="text-xs">Rua <span className="text-destructive">*</span></Label>
                    <Input id="addr-street" placeholder="Rua" {...register("address.street")} />
                    {errors.address?.street && <p className="text-destructive text-xs">{errors.address.street.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addr-number" className="text-xs">Número <span className="text-destructive">*</span></Label>
                    <Input id="addr-number" placeholder="123" {...register("address.number")} />
                    {errors.address?.number && <p className="text-destructive text-xs">{errors.address.number.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addr-complement" className="text-xs">Complemento</Label>
                    <Input id="addr-complement" placeholder="Apto 101" {...register("address.complement")} />
                  </div>
                </div>

                {/* Bairro e Cidade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="addr-neighborhood" className="text-xs">Bairro <span className="text-destructive">*</span></Label>
                    <Input id="addr-neighborhood" placeholder="Centro" {...register("address.neighborhood")} />
                    {errors.address?.neighborhood && <p className="text-destructive text-xs">{errors.address.neighborhood.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addr-city" className="text-xs">Cidade <span className="text-destructive">*</span></Label>
                    <Input id="addr-city" placeholder="São Paulo" {...register("address.city")} />
                    {errors.address?.city && <p className="text-destructive text-xs">{errors.address.city.message}</p>}
                  </div>
                </div>

                {/* Estado e País */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="addr-state" className="text-xs">Estado <span className="text-destructive">*</span></Label>
                    <Input id="addr-state" placeholder="SP" maxLength={2} {...register("address.state")} />
                    {errors.address?.state && <p className="text-destructive text-xs">{errors.address.state.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addr-country" className="text-xs">País <span className="text-destructive">*</span></Label>
                    <Input id="addr-country" placeholder="Brasil" {...register("address.country")} />
                    {errors.address?.country && <p className="text-destructive text-xs">{errors.address.country.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <DialogFooter className="gap-2 border-t pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="min-w-35 shadow-md"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : isEditing ? (
                  "Salvar Alterações"
                ) : (
                  "Cadastrar Cliente"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

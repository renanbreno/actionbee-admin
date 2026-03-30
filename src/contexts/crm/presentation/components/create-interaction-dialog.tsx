"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";
import { createInteractionSchema, type CreateInteractionFormValues } from "../schemas/interaction.schema";
import { useCreateInteraction } from "../hooks/use-create-interaction";
import { useCustomers } from "@/contexts/customers/presentation/hooks/use-customers";
import { useAuth } from "@/contexts/auth/presentation/hooks/use-auth";
import { maskDate, unmaskDate, formatDate } from "@/shared/utils/masks";
import { InteractionType } from "../../domain/enums";

const INTERACTION_LABELS: Record<string, string> = {
  CALL: "Ligação",
  EMAIL: "E-mail",
  MEETING: "Reunião",
  NOTE: "Nota",
  WHATSAPP: "WhatsApp",
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultCustomerId?: string;
  defaultDealId?: string;
}

export function CreateInteractionDialog({
  open,
  onOpenChange,
  defaultCustomerId,
  defaultDealId,
}: Props) {
  const createMutation = useCreateInteraction();
  const { user } = useAuth();

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustomType, setIsCustomType] = useState(false);

  const { data: customersData } = useCustomers(
    1,
    20,
    customerSearch.trim().length >= 2 ? customerSearch.trim() : undefined
  );
  const customers = customerSearch.trim().length >= 2 ? (customersData?.customers ?? []) : [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateInteractionFormValues>({
    resolver: zodResolver(createInteractionSchema),
    defaultValues: {
      customerId: defaultCustomerId ?? "",
      type: InteractionType.CALL,
      description: "",
      dealId: defaultDealId ?? "",
      subject: "",
      occurredAt: formatDate(new Date().toISOString()),
    },
  });

  const typeValue = watch("type");
  const selectedCustomerId = watch("customerId");

  useEffect(() => {
    if (!open) {
      reset();
      setCustomerSearch("");
      setSelectedCustomerName("");
      setShowDropdown(false);
      setIsCustomType(false);
    }
  }, [open, reset]);

  const onSubmit = (values: CreateInteractionFormValues) => {
    const isoDate = unmaskDate(values.occurredAt ?? "");
    createMutation.mutate(
      {
        ...values,
        occurredAt: isoDate ?? undefined,
        dealId: values.dealId || undefined,
        subject: values.subject || undefined,
        createdByAdminId: user?.id,
      },
      {
        onSuccess: () => {
          reset();
          setCustomerSearch("");
          setSelectedCustomerName("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Interação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Cliente — só exibe busca se não foi pré-selecionado */}
          {!defaultCustomerId && (
            <div className="space-y-2">
              <Label>
                Cliente <span className="text-destructive">*</span>
              </Label>
              {selectedCustomerId && selectedCustomerName ? (
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-medium">{selectedCustomerName}</span>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-2 shrink-0"
                    onClick={() => {
                      setValue("customerId", "");
                      setSelectedCustomerName("");
                      setCustomerSearch("");
                    }}
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    placeholder="Digite pelo menos 2 caracteres para buscar..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    autoComplete="off"
                  />
                  {showDropdown && customers.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md max-h-44 overflow-y-auto">
                      {customers.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                          onMouseDown={() => {
                            setValue("customerId", c.id);
                            setSelectedCustomerName(c.name);
                            setCustomerSearch("");
                            setShowDropdown(false);
                          }}
                        >
                          <span className="font-medium">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">{c.email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showDropdown && customerSearch.trim().length >= 2 && customers.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md px-3 py-2.5 text-sm text-muted-foreground">
                      Nenhum cliente encontrado
                    </div>
                  )}
                </div>
              )}
              {errors.customerId && (
                <p className="text-sm text-destructive">{errors.customerId.message}</p>
              )}
            </div>
          )}

          {/* Tipo */}
          <div className="space-y-1.5">
            <Label>
              Tipo <span className="text-destructive">*</span>
            </Label>
            {isCustomType ? (
              <div className="flex gap-1.5 items-center">
                <Input
                  placeholder="Nome do tipo..."
                  autoFocus
                  onChange={(e) => setValue("type", e.target.value as InteractionType)}
                  className="flex-1"
                />
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground underline shrink-0"
                  onClick={() => { setIsCustomType(false); setValue("type", InteractionType.CALL); }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <Select
                value={typeValue ?? ""}
                onValueChange={(v) => setValue("type", v as InteractionType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(InteractionType).map((t) => (
                    <SelectItem key={t} value={t}>{INTERACTION_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isCustomType && (
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-amber-700 hover:underline font-medium"
                onClick={() => { setIsCustomType(true); setValue("type", "" as InteractionType); }}
              >
                <Plus className="h-3 w-3" />
                Novo tipo
              </button>
            )}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="interaction-date">Data</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="interaction-date"
                type="text"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className="pl-9"
                {...register("occurredAt", {
                  onChange: (e) => {
                    const masked = maskDate(e.target.value);
                    setValue("occurredAt", masked);
                  },
                })}
              />
            </div>
            {errors.occurredAt && (
              <p className="text-sm text-destructive">{errors.occurredAt.message}</p>
            )}
          </div>

          {/* Assunto */}
          <div className="space-y-2">
            <Label htmlFor="interaction-subject">
              Assunto <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="interaction-subject"
              placeholder="Ex: Follow-up proposta"
              {...register("subject")}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="interaction-desc">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="interaction-desc"
              rows={3}
              placeholder="Descreva a interação..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogActions
            isLoading={createMutation.isPending}
            submitLabel="Registrar"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

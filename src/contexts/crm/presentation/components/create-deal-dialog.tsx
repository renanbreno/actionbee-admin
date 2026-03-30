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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";
import { createDealSchema, type CreateDealFormValues } from "../schemas/deal.schema";
import { useCreateDeal } from "../hooks/use-create-deal";
import { usePipelines } from "../hooks/use-pipelines";
import { useAddPipelineStage } from "../hooks/use-add-pipeline-stage";
import { useCustomers } from "@/contexts/customers/presentation/hooks/use-customers";
import { useAuth } from "@/contexts/auth/presentation/hooks/use-auth";
import { maskDate, unmaskDate, maskCurrency, currencyToNumber } from "@/shared/utils/masks";
import { DealSource } from "../../domain/enums";
import { CustomerFormDialog } from "@/contexts/customers/presentation/components/customer-form-dialog";
import type { Customer } from "@/contexts/customers/domain/entities/customer";
import type { Pipeline } from "../../domain/entities/pipeline";

const DEAL_SOURCE_LABELS: Record<string, string> = {
  ECOMMERCE: "E-commerce",
  LEAD_CAPTURE: "Captação de Lead",
  MANUAL: "Manual",
  REFERRAL: "Indicação",
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultPipelineId?: string;
}

export function CreateDealDialog({ open, onOpenChange, defaultPipelineId }: Props) {
  const createMutation = useCreateDeal();
  const addStageMutation = useAddPipelineStage();
  const { user } = useAuth();
  const { data: pipelines = [] } = usePipelines();

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);

  const [isAddingStage, setIsAddingStage] = useState(false);
  const [stageName, setStageName] = useState("");

  const [isCustomSource, setIsCustomSource] = useState(false);

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
  } = useForm<CreateDealFormValues>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      title: "",
      pipelineId: defaultPipelineId ?? "",
      stageId: "",
      customerId: "",
      description: "",
      estimatedValue: "",
      expectedCloseDate: "",
      source: undefined,
    },
  });

  const selectedPipelineId = watch("pipelineId");
  const selectedStageId = watch("stageId");
  const selectedCustomerId = watch("customerId");
  const sourceValue = watch("source");

  const selectedPipeline = pipelines.find((p) => p.id === selectedPipelineId);
  const stages = selectedPipeline?.stages.slice().sort((a, b) => a.order - b.order) ?? [];

  useEffect(() => {
    setValue("stageId", "");
    setIsAddingStage(false);
    setStageName("");
  }, [selectedPipelineId, setValue]);

  useEffect(() => {
    if (defaultPipelineId) setValue("pipelineId", defaultPipelineId);
  }, [defaultPipelineId, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setCustomerSearch("");
      setSelectedCustomerName("");
      setShowDropdown(false);
      setIsAddingStage(false);
      setStageName("");
      setIsCustomSource(false);
    }
  }, [open, reset]);

  const handleCustomerCreated = (customer: Customer) => {
    setValue("customerId", customer.id);
    setSelectedCustomerName(customer.name);
    setCustomerFormOpen(false);
  };

  const handleAddStage = () => {
    if (!stageName.trim() || !selectedPipelineId) return;
    const order = stages.length + 1;
    addStageMutation.mutate(
      { pipelineId: selectedPipelineId, dto: { name: stageName.trim(), order } },
      {
        onSuccess: (updatedPipeline: Pipeline) => {
          const newStage = updatedPipeline.stages.find((s) => s.name === stageName.trim());
          if (newStage) setValue("stageId", newStage.id);
          setIsAddingStage(false);
          setStageName("");
        },
      }
    );
  };

  const onSubmit = (values: CreateDealFormValues) => {
    const isoDate = unmaskDate(values.expectedCloseDate ?? "");
    const numericValue = values.estimatedValue ? currencyToNumber(values.estimatedValue) : undefined;
    createMutation.mutate(
      {
        ...values,
        estimatedValue: numericValue,
        expectedCloseDate: isoDate ?? undefined,
        assignedAdminId: user?.id,
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Negócio</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="deal-title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="deal-title"
                placeholder="Ex: Proposta para Cliente X"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Cliente — busca sob demanda + cadastro rápido */}
            <div className="space-y-1.5">
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
                <>
                  <div className="relative">
                    <Input
                      placeholder="Buscar cliente..."
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
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-amber-700 hover:underline font-medium"
                    onClick={() => setCustomerFormOpen(true)}
                  >
                    <Plus className="h-3 w-3" />
                    Novo cliente
                  </button>
                </>
              )}
              {errors.customerId && (
                <p className="text-sm text-destructive">{errors.customerId.message}</p>
              )}
            </div>

            {/* Pipeline + Estágio */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Pipeline <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedPipelineId} onValueChange={(v) => setValue("pipelineId", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pipelineId && (
                  <p className="text-sm text-destructive">{errors.pipelineId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>
                  Estágio <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedStageId}
                  onValueChange={(v) => setValue("stageId", v)}
                  disabled={!selectedPipelineId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedPipelineId ? "Selecione..." : "Selecione o pipeline"} />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.order}. {s.name}
                        {s.isWonStage && " 🏆"}
                        {s.isLostStage && " ❌"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPipelineId && (
                  <Popover open={isAddingStage} onOpenChange={(v) => { setIsAddingStage(v); if (!v) setStageName(""); }}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-amber-700 hover:underline font-medium"
                      >
                        <Plus className="h-3 w-3" />
                        Novo estágio
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="start">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Novo Estágio</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Será adicionado ao pipeline selecionado
                          </p>
                        </div>
                        <Input
                          placeholder="Nome do estágio..."
                          value={stageName}
                          onChange={(e) => setStageName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); handleAddStage(); }
                            if (e.key === "Escape") { setIsAddingStage(false); setStageName(""); }
                          }}
                          autoFocus
                          className="h-8 text-sm"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => { setIsAddingStage(false); setStageName(""); }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleAddStage}
                            disabled={!stageName.trim() || addStageMutation.isPending}
                          >
                            Criar
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                {errors.stageId && (
                  <p className="text-sm text-destructive">{errors.stageId.message}</p>
                )}
              </div>
            </div>

            {/* Valor estimado + Previsão de fechamento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deal-value">
                  Valor (R$) <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  id="deal-value"
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  {...register("estimatedValue", {
                    onChange: (e) => {
                      const masked = maskCurrency(e.target.value);
                      setValue("estimatedValue", masked);
                    },
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deal-close-date">
                  Fechamento <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="deal-close-date"
                    type="text"
                    placeholder="dd/mm/aaaa"
                    maxLength={10}
                    className="pl-9"
                    {...register("expectedCloseDate", {
                      onChange: (e) => {
                        const masked = maskDate(e.target.value);
                        setValue("expectedCloseDate", masked);
                      },
                    })}
                  />
                </div>
                {errors.expectedCloseDate && (
                  <p className="text-sm text-destructive">{errors.expectedCloseDate.message}</p>
                )}
              </div>
            </div>

            {/* Origem */}
            <div className="space-y-1.5">
              <Label>
                Origem <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              {isCustomSource ? (
                <div className="flex gap-1.5 items-center">
                  <Input
                    placeholder="Digite a origem..."
                    autoFocus
                    onChange={(e) => setValue("source", e.target.value || undefined)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline shrink-0"
                    onClick={() => { setIsCustomSource(false); setValue("source", undefined); }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <Select
                  value={sourceValue ?? ""}
                  onValueChange={(v) => setValue("source", v || undefined)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a origem..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DealSource).map((s) => (
                      <SelectItem key={s} value={s}>{DEAL_SOURCE_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {!isCustomSource && (
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-amber-700 hover:underline font-medium"
                  onClick={() => { setIsCustomSource(true); setValue("source", undefined); }}
                >
                  <Plus className="h-3 w-3" />
                  Nova origem
                </button>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="deal-desc">
                Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Textarea
                id="deal-desc"
                rows={3}
                placeholder="Detalhes do negócio..."
                {...register("description")}
              />
            </div>

            <DialogActions
              isLoading={createMutation.isPending}
              submitLabel="Criar Negócio"
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </DialogContent>
      </Dialog>

      <CustomerFormDialog
        open={customerFormOpen}
        onOpenChange={setCustomerFormOpen}
        onCreated={handleCustomerCreated}
      />
    </>
  );
}

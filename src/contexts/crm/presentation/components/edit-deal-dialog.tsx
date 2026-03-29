"use client";

import { useEffect } from "react";
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
import { Calendar } from "lucide-react";
import { updateDealSchema, type UpdateDealFormValues } from "../schemas/deal.schema";
import { useUpdateDeal } from "../hooks/use-update-deal";
import { maskDate, unmaskDate, formatDate, maskCurrency, currencyToNumber, formatCurrency } from "@/shared/utils/masks";
import type { Deal } from "../../domain/entities/deal";

interface Props {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditDealDialog({ deal, open, onOpenChange }: Props) {
  const updateMutation = useUpdateDeal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateDealFormValues>({
    resolver: zodResolver(updateDealSchema),
    defaultValues: { title: "", description: "", estimatedValue: "", expectedCloseDate: "" },
  });

  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title,
        description: deal.description ?? "",
        estimatedValue: deal.estimatedValue != null ? formatCurrency(deal.estimatedValue) : "",
        expectedCloseDate: deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : "",
      });
    }
  }, [deal, reset]);

  const onSubmit = (values: UpdateDealFormValues) => {
    if (!deal) return;
    const isoDate = unmaskDate(values.expectedCloseDate ?? "");
    const numericValue = values.estimatedValue ? currencyToNumber(values.estimatedValue) : undefined;
    updateMutation.mutate(
      {
        id: deal.id,
        dto: {
          ...values,
          estimatedValue: numericValue,
          expectedCloseDate: isoDate ?? undefined,
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Negócio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          <div className="space-y-2">
            <Label htmlFor="edit-deal-title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input id="edit-deal-title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-deal-value">
                Valor (R$) <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="edit-deal-value"
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
              <Label htmlFor="edit-deal-date">
                Fechamento <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="edit-deal-date"
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

          <div className="space-y-2">
            <Label htmlFor="edit-deal-desc">
              Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea id="edit-deal-desc" rows={3} {...register("description")} />
          </div>

          <DialogActions
            isLoading={updateMutation.isPending}
            submitLabel="Salvar"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Box } from "lucide-react";
import {
  updateUnitSchema,
  UpdateUnitFormValues,
} from "../schemas/unit.schema";
import { useUpdateUnit } from "../hooks";
import { Unit } from "../../domain/entities/unit";

interface EditUnitDialogProps {
  unit: Unit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUnitDialog({
  unit,
  open,
  onOpenChange,
}: EditUnitDialogProps) {
  const updateMutation = useUpdateUnit();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUnitFormValues>({
    resolver: zodResolver(updateUnitSchema),
    defaultValues: {
      acronym: "",
      name: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (unit) {
      reset({
        acronym: unit.acronym,
        name: unit.name,
        isActive: unit.isActive,
      });
    }
  }, [unit, reset]);

  const onSubmit = (values: UpdateUnitFormValues) => {
    if (!unit) return;

    updateMutation.mutate(
      { id: unit.id, input: values },
      {
        onSuccess: () => {
          toast.success("Unidade atualizada com sucesso!");
          onOpenChange(false);
        },
        onError: (error) => {
          if (error.message?.includes("já cadastrada")) {
            toast.error("Esta sigla já está cadastrada para outra unidade.");
          } else {
            toast.error(error.message ?? "Erro ao atualizar unidade");
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Box className="h-4 w-4 text-bee-gold" />
            Editar Unidade de Medida
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-acronym">
              Sigla <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-acronym"
              placeholder="Ex: CX, UN, KG"
              maxLength={10}
              {...register("acronym")}
              className="uppercase"
            />
            {errors.acronym && (
              <p className="text-sm text-destructive">{errors.acronym.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Ex: Caixa, Unidade, Quilograma"
              maxLength={100}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="edit-isActive" className="text-base">
                Unidade ativa
              </Label>
              <p className="text-xs text-muted-foreground">
                Unidades inativas não ficam disponíveis para seleção
              </p>
            </div>
            <Switch
              id="edit-isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogActions
            isLoading={updateMutation.isPending}
            loadingText="Salvando..."
            submitLabel="Salvar alterações"
            cancelLabel="Cancelar"
            onCancel={() => onOpenChange(false)}
            submitButtonProps={{
              className: "w-full bg-bee-gold text-black hover:bg-bee-amber sm:w-auto",
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

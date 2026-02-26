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
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import {
  createUnitSchema,
  CreateUnitFormValues,
} from "../schemas/unit.schema";
import { useCreateUnit } from "../hooks";

interface CreateUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUnitDialog({
  open,
  onOpenChange,
}: CreateUnitDialogProps) {
  const createMutation = useCreateUnit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUnitFormValues>({
    resolver: zodResolver(createUnitSchema),
    defaultValues: {
      acronym: "",
      name: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (values: CreateUnitFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Unidade criada com sucesso!");
        onOpenChange(false);
      },
      onError: (error) => {
        if (error.message?.includes("já cadastrada")) {
          toast.error("Esta sigla já está cadastrada.");
        } else {
          toast.error(error.message ?? "Erro ao criar unidade");
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Box className="h-4 w-4 text-bee-gold" />
            Nova Unidade de Medida
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="create-acronym">
              Sigla <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-acronym"
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
            <Label htmlFor="create-name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-name"
              placeholder="Ex: Caixa, Unidade, Quilograma"
              maxLength={100}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogActions
            isLoading={createMutation.isPending}
            submitLabel="Criar unidade"
            onCancel={() => onOpenChange(false)}
            submitButtonProps={{
              className: "bg-bee-gold text-black hover:bg-bee-amber",
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { updatePipelineSchema, type UpdatePipelineFormValues } from "../schemas/pipeline.schema";
import { useUpdatePipeline } from "../hooks/use-update-pipeline";
import type { Pipeline } from "../../domain/entities/pipeline";

interface Props {
  pipeline: Pipeline | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditPipelineDialog({ pipeline, open, onOpenChange }: Props) {
  const updateMutation = useUpdatePipeline();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePipelineFormValues>({
    resolver: zodResolver(updatePipelineSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (pipeline) reset({ name: pipeline.name, description: pipeline.description ?? "" });
  }, [pipeline, reset]);

  const onSubmit = (values: UpdatePipelineFormValues) => {
    if (!pipeline) return;
    updateMutation.mutate({ id: pipeline.id, dto: values }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pipeline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-pipeline-name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input id="edit-pipeline-name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-pipeline-desc">
              Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea id="edit-pipeline-desc" rows={3} {...register("description")} />
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

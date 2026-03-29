"use client";

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
import { createPipelineSchema, type CreatePipelineFormValues } from "../schemas/pipeline.schema";
import { useCreatePipeline } from "../hooks/use-create-pipeline";
import { PipelineType } from "../../domain/enums";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreatePipelineDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreatePipeline();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePipelineFormValues>({
    resolver: zodResolver(createPipelineSchema),
    defaultValues: { name: "", type: PipelineType.B2C, description: "" },
  });

  const typeValue = watch("type");

  const onSubmit = (values: CreatePipelineFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Pipeline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="pipeline-name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input id="pipeline-name" placeholder="Ex: Pipeline B2B" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Tipo <span className="text-destructive">*</span>
            </Label>
            <Select value={typeValue} onValueChange={(v) => setValue("type", v as PipelineType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PipelineType.B2B}>B2B</SelectItem>
                <SelectItem value={PipelineType.B2C}>B2C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pipeline-desc">
              Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="pipeline-desc"
              rows={3}
              placeholder="Descreva o pipeline..."
              {...register("description")}
            />
          </div>

          <DialogActions
            isLoading={createMutation.isPending}
            submitLabel="Criar Pipeline"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

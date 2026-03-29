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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moveDealStageSchema, type MoveDealStageFormValues } from "../schemas/deal.schema";
import { useMoveDealStage } from "../hooks/use-move-deal-stage";
import { usePipeline } from "../hooks/use-pipeline";
import type { Deal } from "../../domain/entities/deal";

interface Props {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function MoveDealStageDialog({ deal, open, onOpenChange }: Props) {
  const moveMutation = useMoveDealStage();
  const { data: pipeline } = usePipeline(deal?.pipelineId ?? "");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MoveDealStageFormValues>({
    resolver: zodResolver(moveDealStageSchema),
    defaultValues: { stageId: "", lostReason: "" },
  });

  const selectedStageId = watch("stageId");
  const stages = pipeline?.stages.slice().sort((a, b) => a.order - b.order) ?? [];
  const selectedStage = stages.find((s) => s.id === selectedStageId);
  const isLostStage = selectedStage?.isLostStage ?? false;

  useEffect(() => {
    if (deal) reset({ stageId: deal.stageId, lostReason: "" });
  }, [deal, reset]);

  const onSubmit = (values: MoveDealStageFormValues) => {
    if (!deal) return;
    moveMutation.mutate(
      {
        id: deal.id,
        dto: {
          stageId: values.stageId,
          lostReason: isLostStage ? values.lostReason : undefined,
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mover Negócio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label>
              Novo estágio <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedStageId} onValueChange={(v) => setValue("stageId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
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
            {errors.stageId && <p className="text-sm text-destructive">{errors.stageId.message}</p>}
          </div>

          {isLostStage && (
            <div className="space-y-2">
              <Label htmlFor="lost-reason">Motivo da perda</Label>
              <Input id="lost-reason" placeholder="Descreva o motivo..." {...register("lostReason")} />
            </div>
          )}

          <DialogActions
            isLoading={moveMutation.isPending}
            submitLabel="Mover"
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

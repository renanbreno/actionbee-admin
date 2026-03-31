"use client";
import { useState } from "react";
import { usePipeline } from "../hooks/use-pipeline";
import { useAddPipelineStage } from "../hooks/use-add-pipeline-stage";
import { useDeletePipelineStage } from "../hooks/use-delete-pipeline-stage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Trophy, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { pipelineId: string; }

export function PipelineStageManager({ pipelineId }: Props) {
  const { data: pipeline, isLoading } = usePipeline(pipelineId);
  const addStage = useAddPipelineStage();
  const deleteStage = useDeletePipelineStage();
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !pipeline) return;
    const nextOrder = (pipeline.stages.length > 0 ? Math.max(...pipeline.stages.map(s => s.order)) : 0) + 1;
    addStage.mutate({ pipelineId, dto: { name: newName.trim(), order: nextOrder } }, {
      onSuccess: () => setNewName(""),
    });
  };

  if (isLoading) return <div className="py-4 text-center text-sm text-muted-foreground">Carregando estágios...</div>;
  if (!pipeline) return null;

  const sorted = [...pipeline.stages].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">Nenhum estágio. Adicione o primeiro abaixo.</p>
        )}
        {sorted.map((stage) => (
          <div key={stage.id} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
            <span className="text-xs text-muted-foreground w-6 shrink-0 tabular-nums">{stage.order}.</span>
            <span className="flex-1 text-sm font-medium truncate">{stage.name}</span>
            <div className="flex items-center gap-1">
              {stage.isWonStage && <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-xs gap-1"><Trophy className="h-2.5 w-2.5" />Ganho</Badge>}
              {stage.isLostStage && <Badge variant="outline" className="border-red-400/30 bg-red-400/10 text-red-500 text-xs gap-1"><ThumbsDown className="h-2.5 w-2.5" />Perdido</Badge>}
              <span className="text-xs text-muted-foreground">{stage.dealsCount} deals</span>
            </div>
            <Button
              variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
              disabled={deleteStage.isPending}
              onClick={() => deleteStage.mutate({ pipelineId, stageId: stage.id })}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Nome do novo estágio"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
          className="h-9 text-sm"
        />
        <Button size="sm" onClick={handleAdd} disabled={addStage.isPending || !newName.trim()} className="shrink-0 gap-1">
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}

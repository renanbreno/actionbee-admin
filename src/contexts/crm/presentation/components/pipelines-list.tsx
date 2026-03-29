"use client";

import { useState } from "react";
import { usePipelines } from "../hooks/use-pipelines";
import { useDeletePipeline } from "../hooks/use-delete-pipeline";
import { CreatePipelineDialog } from "./create-pipeline-dialog";
import { EditPipelineDialog } from "./edit-pipeline-dialog";
import { PipelineStageManager } from "./pipeline-stage-manager";
import type { Pipeline } from "../../domain/entities/pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MoreHorizontal, Pencil, Trash2, GitBranch, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium",
      type === "B2B" ? "border-blue-500/30 bg-blue-500/10 text-blue-600" : "border-amber-500/30 bg-amber-500/10 text-amber-600"
    )}>
      {type}
    </Badge>
  );
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium",
      isActive ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-zinc-400/30 bg-zinc-400/10 text-zinc-500"
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-zinc-400")} />
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
}

export function PipelinesList() {
  const { data: pipelines = [], isLoading, isError } = usePipelines();
  const deleteMutation = useDeletePipeline();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingPipeline, setDeletingPipeline] = useState<Pipeline | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [stagesPipeline, setStagesPipeline] = useState<Pipeline | null>(null);
  const [stagesOpen, setStagesOpen] = useState(false);

  const handleEdit = (p: Pipeline) => { setEditingPipeline(p); setEditOpen(true); };
  const handleDeleteRequest = (p: Pipeline) => { setDeletingPipeline(p); setDeleteOpen(true); };
  const handleManageStages = (p: Pipeline) => { setStagesPipeline(p); setStagesOpen(true); };

  const handleDeleteConfirm = () => {
    if (!deletingPipeline) return;
    deleteMutation.mutate(deletingPipeline.id, {
      onSuccess: () => { setDeleteOpen(false); setDeletingPipeline(null); },
    });
  };

  function PipelineActions({ pipeline }: { pipeline: Pipeline }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleEdit(pipeline)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleManageStages(pipeline)}>
            <Layers className="mr-2 h-3.5 w-3.5" />Gerenciar Estágios
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDeleteRequest(pipeline)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5" />Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <GitBranch className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Nenhum pipeline cadastrado</p>
      <p className="mt-1 text-xs text-muted-foreground/60">Crie o primeiro pipeline para começar</p>
    </div>
  );

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm animate-pulse space-y-3">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      ))}
      {isError && <p className="text-sm text-destructive text-center py-8">Erro ao carregar pipelines</p>}
      {!isLoading && !isError && pipelines.length === 0 && <EmptyState />}
      {pipelines.map((p) => (
        <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              {p.description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <TypeBadge type={p.type} />
                <ActiveBadge isActive={p.isActive} />
                <span className="text-xs text-muted-foreground">{p.stages.length} estágios</span>
                <span className="text-xs text-muted-foreground">{p.totalDeals} deals</span>
              </div>
            </div>
            <PipelineActions pipeline={p} />
          </div>
        </div>
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pipeline</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estágios</TableHead>
            <TableHead>Deals</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((__, j) => (
                <TableCell key={j}><div className="h-4 rounded bg-muted animate-pulse" /></TableCell>
              ))}
            </TableRow>
          ))}
          {isError && <TableRow><TableCell colSpan={6}><p className="text-sm text-destructive text-center py-4">Erro ao carregar</p></TableCell></TableRow>}
          {!isLoading && !isError && pipelines.length === 0 && (
            <TableRow><TableCell colSpan={6}><EmptyState /></TableCell></TableRow>
          )}
          {pipelines.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  {p.description && <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>}
                </div>
              </TableCell>
              <TableCell><TypeBadge type={p.type} /></TableCell>
              <TableCell className="text-sm">{p.stages.length}</TableCell>
              <TableCell className="text-sm">{p.totalDeals}</TableCell>
              <TableCell><ActiveBadge isActive={p.isActive} /></TableCell>
              <TableCell className="text-right"><PipelineActions pipeline={p} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipelines</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus funis de vendas</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Pipeline</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {mobileView}
      {desktopView}

      <CreatePipelineDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditPipelineDialog pipeline={editingPipeline} open={editOpen} onOpenChange={setEditOpen} />

      <Dialog open={stagesOpen} onOpenChange={setStagesOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Estágios — {stagesPipeline?.name}</DialogTitle>
          </DialogHeader>
          {stagesPipeline && <PipelineStageManager pipelineId={stagesPipeline.id} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pipeline</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pipeline <strong>{deletingPipeline?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

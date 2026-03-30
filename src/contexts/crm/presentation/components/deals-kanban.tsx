"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDeals } from "../hooks/use-deals";
import { usePipelines } from "../hooks/use-pipelines";
import { useDeleteDeal } from "../hooks/use-delete-deal";
import { useMoveDealStage } from "../hooks/use-move-deal-stage";
import { CreateDealDialog } from "./create-deal-dialog";
import { EditDealDialog } from "./edit-deal-dialog";
import { MoveDealStageDialog } from "./move-deal-stage-dialog";
import { DealDetailSheet } from "./deal-detail-sheet";
import type { Deal } from "../../domain/entities/deal";
import type { PipelineStage } from "../../domain/entities/pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  MessageSquare,
  CheckSquare,
  Trophy,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(value?: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

// ── Shared card content (used in draggable and overlay) ──────────────────────
function DealCardBody({ deal }: { deal: Deal }) {
  return (
    <>
      <p className="text-sm font-semibold leading-tight line-clamp-2 flex-1">{deal.title}</p>
      <p className="mt-1 text-xs text-muted-foreground truncate">{deal.customerName}</p>
      {deal.estimatedValue != null && (
        <p className="mt-1.5 text-xs font-semibold text-bee-gold">
          {formatCurrency(deal.estimatedValue)}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {deal.interactionsCount > 0 && (
          <span className="flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {deal.interactionsCount}
          </span>
        )}
        {deal.tasksCount > 0 && (
          <span className="flex items-center gap-0.5">
            <CheckSquare className="h-3 w-3" />
            {deal.tasksCount}
          </span>
        )}
      </div>
    </>
  );
}

// ── Draggable deal card ───────────────────────────────────────────────────────
interface DealCardProps {
  deal: Deal;
  onView: (d: Deal) => void;
  onEdit: (d: Deal) => void;
  onDelete: (d: Deal) => void;
}

function DealCard({ deal, onView, onEdit, onDelete }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-bee-gold/50 transition-colors",
        isDragging && "opacity-40"
      )}
      onClick={() => onView(deal)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <DealCardBody deal={deal} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 -mr-1 -mt-0.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onView(deal)}>
              <Eye className="mr-2 h-3.5 w-3.5" />Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(deal)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(deal)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ── Drag overlay card (ghost following cursor) ────────────────────────────────
function DealCardOverlay({ deal }: { deal: Deal }) {
  return (
    <div className="rounded-lg border border-bee-gold/60 bg-card p-3 shadow-2xl w-72 rotate-1 opacity-95">
      <DealCardBody deal={deal} />
    </div>
  );
}

// ── Droppable stage column ────────────────────────────────────────────────────
interface StageColumnProps {
  stage: PipelineStage;
  deals: Deal[];
  isLoading: boolean;
  onView: (d: Deal) => void;
  onEdit: (d: Deal) => void;
  onDelete: (d: Deal) => void;
  onAddDeal: () => void;
}

function StageColumn({
  stage,
  deals,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAddDeal,
}: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id, data: { stage } });

  const stageValue = deals.reduce((sum, d) => sum + (d.estimatedValue ?? 0), 0);

  return (
    <div
      className={cn(
        "flex-none w-72 rounded-xl border flex flex-col transition-colors",
        isOver ? "border-bee-gold/60 bg-bee-gold/5" : "bg-muted/30"
      )}
    >
      <div className="px-3 py-2.5 border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {stage.isWonStage && <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
          {stage.isLostStage && <ThumbsDown className="h-3.5 w-3.5 text-red-500 shrink-0" />}
          <span className="text-sm font-semibold truncate">{stage.name}</span>
          <Badge variant="secondary" className="text-xs shrink-0">{deals.length}</Badge>
        </div>
        {stageValue > 0 && (
          <span className="text-xs text-bee-gold font-medium shrink-0">{formatCurrency(stageValue)}</span>
        )}
      </div>

      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-30">
        {isLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && deals.length === 0 && (
          <div
            className={cn(
              "flex items-center justify-center h-16 rounded-lg border-2 border-dashed transition-colors",
              isOver ? "border-bee-gold/50 bg-bee-gold/10" : "border-muted-foreground/20"
            )}
          >
            <p className="text-xs text-muted-foreground">
              {isOver ? "Soltar aqui" : "Sem negócios"}
            </p>
          </div>
        )}
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="px-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-1.5 h-8 text-xs text-muted-foreground hover:text-foreground"
          onClick={onAddDeal}
        >
          <Plus className="h-3 w-3" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}

// ── Main kanban board ─────────────────────────────────────────────────────────
export function DealsKanban() {
  const { data: pipelines = [] } = usePipelines();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const effectivePipelineId = selectedPipelineId || pipelines[0]?.id || "";

  const { data: dealsData, isLoading } = useDeals(1, 100, {
    pipelineId: effectivePipelineId || undefined,
  });
  const deals = dealsData?.items ?? [];
  const deleteMutation = useDeleteDeal();
  const moveMutation = useMoveDealStage();

  const selectedPipeline = pipelines.find((p) => p.id === effectivePipelineId);
  const stages = selectedPipeline?.stages.slice().sort((a, b) => a.order - b.order) ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [movingDeal, setMovingDeal] = useState<Deal | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [viewingDeal, setViewingDeal] = useState<Deal | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const handleEdit = (d: Deal) => { setEditingDeal(d); setEditOpen(true); };
  const handleView = (d: Deal) => { setViewingDeal(d); setDetailOpen(true); };
  const handleDeleteRequest = (d: Deal) => { setDeletingDeal(d); setDeleteOpen(true); };

  const handleDeleteConfirm = () => {
    if (!deletingDeal) return;
    deleteMutation.mutate(deletingDeal.id, {
      onSuccess: () => { setDeleteOpen(false); setDeletingDeal(null); },
    });
  };

  const dealsByStage = (stageId: string) => deals.filter((d) => d.stageId === stageId);

  const totalValue = deals.reduce((sum, d) => sum + (d.estimatedValue ?? 0), 0);

  // ── DnD sensors ──────────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = event.active.data.current?.deal as Deal | undefined;
    setActiveDeal(deal ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const deal = active.data.current?.deal as Deal | undefined;
    const targetStageId = over.id as string;

    if (!deal || deal.stageId === targetStageId) return;

    const targetStage = stages.find((s) => s.id === targetStageId);
    if (!targetStage) return;

    if (targetStage.isLostStage) {
      // Needs lostReason — open dialog
      setMovingDeal(deal);
      setMoveOpen(true);
    } else {
      moveMutation.mutate({ id: deal.id, dto: { stageId: targetStageId } });
    }
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Negócios</h1>
            {deals.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {deals.length} negócio{deals.length !== 1 ? "s" : ""} · {formatCurrency(totalValue)} em potencial
              </p>
            )}
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Negócio</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>

        {pipelines.length > 1 && (
          <Select value={effectivePipelineId} onValueChange={setSelectedPipelineId}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Selecione o pipeline..." />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!effectivePipelineId && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">Nenhum pipeline disponível. Crie um pipeline primeiro.</p>
        </div>
      )}

      {effectivePipelineId && stages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Este pipeline não tem estágios. Adicione estágios na página de Pipelines.
          </p>
        </div>
      )}

      {effectivePipelineId && stages.length > 0 && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
            {stages.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                deals={dealsByStage(stage.id)}
                isLoading={isLoading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                onAddDeal={() => setCreateOpen(true)}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <CreateDealDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultPipelineId={effectivePipelineId}
      />
      <EditDealDialog deal={editingDeal} open={editOpen} onOpenChange={setEditOpen} />
      <MoveDealStageDialog deal={movingDeal} open={moveOpen} onOpenChange={setMoveOpen} />
      <DealDetailSheet deal={viewingDeal} open={detailOpen} onOpenChange={setDetailOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir negócio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{deletingDeal?.title}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

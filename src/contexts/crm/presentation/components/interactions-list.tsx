"use client";

import { useMemo, useState } from "react";
import { useInteractions } from "../hooks/use-interactions";
import { useDeals } from "../hooks/use-deals";
import { useDeleteInteraction } from "../hooks/use-delete-interaction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Phone,
  Mail,
  Video,
  FileText,
  MessageCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractionType } from "../../domain/enums";
import type { Interaction } from "../../domain/entities/interaction";

const INTERACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  CALL: {
    label: "Ligação",
    icon: <Phone className="h-3.5 w-3.5" />,
    className: "border-blue-500/30 bg-blue-500/10 text-blue-600",
  },
  EMAIL: {
    label: "E-mail",
    icon: <Mail className="h-3.5 w-3.5" />,
    className: "border-purple-500/30 bg-purple-500/10 text-purple-600",
  },
  MEETING: {
    label: "Reunião",
    icon: <Video className="h-3.5 w-3.5" />,
    className: "border-orange-500/30 bg-orange-500/10 text-orange-600",
  },
  NOTE: {
    label: "Nota",
    icon: <FileText className="h-3.5 w-3.5" />,
    className: "border-zinc-400/30 bg-zinc-400/10 text-zinc-500",
  },
  WHATSAPP: {
    label: "WhatsApp",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  },
};

function TypeBadge({ type }: { type: string }) {
  const config = INTERACTION_CONFIG[type];
  if (!config) {
    return (
      <Badge variant="outline" className="text-xs font-medium">
        {type}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 text-xs font-medium", config.className)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

type Period = "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "LAST_30_DAYS";

function getPeriodDates(period: Period): { occurredAtFrom?: string; occurredAtTo?: string } {
  if (period === "ALL") return {};
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
  const todayStart = new Date(Date.UTC(y, m, d)).toISOString();
  const todayEnd = new Date(Date.UTC(y, m, d, 23, 59, 59, 999)).toISOString();
  switch (period) {
    case "TODAY":
      return { occurredAtFrom: todayStart, occurredAtTo: todayEnd };
    case "THIS_WEEK": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(y, m, d - diff);
      const from = new Date(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate())).toISOString();
      return { occurredAtFrom: from, occurredAtTo: todayEnd };
    }
    case "THIS_MONTH": {
      const from = new Date(Date.UTC(y, m, 1)).toISOString();
      return { occurredAtFrom: from, occurredAtTo: todayEnd };
    }
    case "LAST_30_DAYS": {
      const start = new Date(y, m, d - 29);
      const from = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())).toISOString();
      return { occurredAtFrom: from, occurredAtTo: todayEnd };
    }
  }
}

function DealSearchFilter({
  dealId,
  dealTitle,
  onChange,
}: {
  dealId: string | undefined;
  dealTitle: string | undefined;
  onChange: (id: string | undefined, title: string | undefined) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data } = useDeals(1, 10, query.length >= 2 ? { search: query } : undefined);
  const deals = data?.items ?? [];

  if (dealId && dealTitle) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border bg-background px-3 h-9 text-sm w-full sm:w-52">
        <span className="flex-1 truncate text-xs text-foreground">{dealTitle}</span>
        <button
          type="button"
          onClick={() => { onChange(undefined, undefined); setQuery(""); }}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <Popover open={open && deals.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full sm:w-52">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Filtrar por negócio..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-1 w-52" onOpenAutoFocus={(e) => e.preventDefault()}>
        {deals.map((d) => (
          <button
            key={d.id}
            type="button"
            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted"
            onClick={() => { onChange(d.id, d.title); setQuery(""); setOpen(false); }}
          >
            {d.title}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function InteractionsList() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [period, setPeriod] = useState<Period>("ALL");
  const [dealId, setDealId] = useState<string | undefined>(undefined);
  const [dealTitle, setDealTitle] = useState<string | undefined>(undefined);
  const [deletingInteraction, setDeletingInteraction] = useState<Interaction | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteInteraction();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const periodDates = useMemo(() => getPeriodDates(period), [period]);

  const filters = {
    ...(typeFilter !== "ALL" ? { type: typeFilter } : {}),
    ...(dealId ? { dealId } : {}),
    ...periodDates,
  };

  const { data, isLoading, isError } = useInteractions(page, 20, Object.keys(filters).length > 0 ? filters : undefined);
  const interactions = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleDealChange = (id: string | undefined, title: string | undefined) => {
    setDealId(id);
    setDealTitle(title);
    setPage(1);
  };

  const handleDeleteRequest = (i: Interaction) => {
    setDeletingInteraction(i);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingInteraction) return;
    deleteMutation.mutate(deletingInteraction.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeletingInteraction(null);
      },
    });
  };

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm animate-pulse space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        ))}
      {isError && (
        <p className="text-sm text-destructive text-center py-8">
          Erro ao carregar interações
        </p>
      )}
      {!isLoading && !isError && interactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma interação encontrada</p>
        </div>
      )}
      {interactions.map((i) => (
        <div key={i.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={i.type} />
                <span className="text-xs text-muted-foreground">{formatDate(i.occurredAt)}</span>
              </div>
              {i.subject && (
                <p className="mt-1 text-sm font-medium">{i.subject}</p>
              )}
              <p className="mt-0.5 text-sm font-semibold text-foreground">{i.customerName}</p>
              {i.dealTitle && (
                <p className="text-xs text-muted-foreground">Negócio: {i.dealTitle}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{i.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => handleDeleteRequest(i)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
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
            <TableHead>Tipo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Assunto / Descrição</TableHead>
            <TableHead>Negócio</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}>
                    <div className="h-4 rounded bg-muted animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-destructive py-8">
                Erro ao carregar interações
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && interactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                Nenhuma interação encontrada
              </TableCell>
            </TableRow>
          )}
          {interactions.map((i) => (
            <TableRow key={i.id}>
              <TableCell>
                <TypeBadge type={i.type} />
              </TableCell>
              <TableCell className="text-sm font-medium">{i.customerName}</TableCell>
              <TableCell>
                <div>
                  {i.subject && (
                    <p className="text-sm font-medium">{i.subject}</p>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-1">{i.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {i.dealTitle ?? "—"}
              </TableCell>
              <TableCell className="text-sm">{formatDate(i.occurredAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteRequest(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Interações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico de interações com clientes
        </p>
      </div>

      <div className="mb-4 flex gap-3 flex-wrap">
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por tipo..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os tipos</SelectItem>
            {Object.values(InteractionType).map((t) => (
              <SelectItem key={t} value={t}>
                {INTERACTION_CONFIG[t]?.label ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={(v) => { setPeriod(v as Period); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Período..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Qualquer período</SelectItem>
            <SelectItem value="TODAY">Hoje</SelectItem>
            <SelectItem value="THIS_WEEK">Esta semana</SelectItem>
            <SelectItem value="THIS_MONTH">Este mês</SelectItem>
            <SelectItem value="LAST_30_DAYS">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>

        <DealSearchFilter dealId={dealId} dealTitle={dealTitle} onChange={handleDealChange} />
      </div>

      {mobileView}
      {desktopView}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir interação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta interação? Esta ação não pode ser desfeita.
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

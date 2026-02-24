"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MonthPicker } from "@/components/ui/month-picker";
import { useShipments } from "@/contexts/affiliate-shipments/presentation/hooks/use-shipments";
import { AffiliateShipmentsList } from "@/contexts/affiliate-shipments/presentation/components/affiliate-shipments-list";
import { CreateShipmentDialog } from "@/contexts/affiliate-shipments/presentation/components/create-shipment-dialog";
import { useAffiliates } from "@/contexts/affiliates/presentation/hooks/use-affiliates";

export default function AffiliateShipmentsPage() {
  const { affiliateId } = useParams<{ affiliateId: string }>();
  const router = useRouter();
  const [month, setMonth] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: shipments = [], isLoading } = useShipments(
    affiliateId,
    month || undefined,
  );
  const { data: affiliates } = useAffiliates();
  const affiliate = affiliates?.find((a) => a.id === affiliateId);

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/affiliates/bonificacoes")}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10 shrink-0">
            <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {affiliate?.name ?? "Afiliado"}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Bonificações enviadas
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] bg-bee-gold hover:bg-bee-amber text-black font-semibold"
        >
          <Plus className="h-4 w-4" />
          Nova bonificação
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">Filtrar por mês:</Label>
        <div className="w-48">
          <MonthPicker
            value={month}
            onChange={setMonth}
            placeholder="Todos os meses"
          />
        </div>
        {month && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMonth("")}
            className="text-muted-foreground"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Bonificações</CardTitle>
          <CardDescription>
            {month
              ? `Envios de ${new Date(`${month}-01`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`
              : "Todos os envios do afiliado"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AffiliateShipmentsList
            affiliateId={affiliateId}
            shipments={shipments}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateDialogOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Nova bonificação"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <CreateShipmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultAffiliateId={affiliateId}
      />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonthlyReport } from "../../domain/entities/affiliate-shipment";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface MonthlyReportTableProps {
  report: MonthlyReport;
}

export function MonthlyReportTable({ report }: MonthlyReportTableProps) {
  const router = useRouter();
  const { summary, affiliates } = report;

  const summaryCards = [
    {
      label: "Afiliados",
      value: summary.totalAffiliates,
      icon: Users,
      format: (v: number) => v.toString(),
    },
    {
      label: "Envios",
      value: summary.totalShipments,
      icon: Package,
      format: (v: number) => v.toString(),
    },
    {
      label: "Itens enviados",
      value: summary.totalItemsSent,
      icon: TrendingUp,
      format: (v: number) => v.toString(),
    },
    {
      label: "Custo total",
      value: summary.totalCost,
      icon: DollarSign,
      format: (v: number) => brl.format(v),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="h-4 w-4 text-bee-gold" />
                <span className="text-xs text-muted-foreground font-medium">
                  {card.label}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">
                {card.format(card.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      {affiliates.length > 0 ? (
        <>
          {/* Mobile: cards */}
          <div className="space-y-3 md:hidden">
            {affiliates.map((aff) => (
              <Card
                key={aff.affiliateId}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() =>
                  router.push(
                    `/dashboard/affiliates/bonificacoes/${aff.affiliateId}`,
                  )
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{aff.affiliateName}</p>
                      <p className="text-xs text-muted-foreground">
                        {aff.categoryName}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Envios</p>
                      <p className="font-medium">{aff.shipmentsCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Itens</p>
                      <p className="font-medium">{aff.totalItemsSent}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Custo</p>
                      <p className="font-medium">{brl.format(aff.totalCost)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Nº Envios</TableHead>
                  <TableHead className="text-center">Total Itens</TableHead>
                  <TableHead className="text-right">Custo Total</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((aff) => (
                  <TableRow
                    key={aff.affiliateId}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() =>
                      router.push(
                        `/dashboard/affiliates/bonificacoes/${aff.affiliateId}`,
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {aff.affiliateName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {aff.categoryName}
                    </TableCell>
                    <TableCell className="text-center">
                      {aff.shipmentsCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {aff.totalItemsSent}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {brl.format(aff.totalCost)}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum envio registrado neste mês.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { RevenueByDay } from "../../domain/entities/dashboard";

interface DashboardRevenueChartProps {
  data: RevenueByDay[];
  isLoading?: boolean;
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: RevenueByDay }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-bee-gold font-medium">{formatCurrency(d.revenue)}</p>
      <p className="text-muted-foreground">
        {d.orders} pedido{d.orders !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export function DashboardRevenueChart({ data, isLoading }: DashboardRevenueChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24 mb-5" />
        <Skeleton className="h-44 w-full rounded-lg" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-center h-32">
        <p className="text-sm text-muted-foreground">Nenhum dado de receita no período.</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-semibold">Receita por Dia</p>
          <p className="text-xs text-muted-foreground">Mês corrente</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-bee-gold">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">total no período</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={176}>
        <AreaChart data={chartData} margin={{ top: 4, right: 20, left: 20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBBD23" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FBBD23" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            interval={Math.ceil(chartData.length / 6) - 1}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#FBBD23"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#FBBD23", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

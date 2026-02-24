"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: number;
  subtitle?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function DashboardMetricCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-bee-gold",
  iconBgColor = "bg-bee-gold/10",
  trend,
  subtitle,
  isLoading,
  fullWidth = false,
}: DashboardMetricCardProps) {
  if (isLoading) {
    return (
      <div className={`rounded-xl border bg-card p-5 shadow-sm ${fullWidth ? "col-span-2" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
      </div>
    );
  }

  const TrendIcon =
    trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor =
    trend === undefined
      ? ""
      : trend > 0
        ? "text-emerald-600"
        : trend < 0
          ? "text-red-500"
          : "text-muted-foreground";

  return (
    <div className={`rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow h-full ${fullWidth ? "col-span-2" : ""}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgColor}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="mt-3">
        <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
        <p className="text-xl sm:text-2xl font-bold mt-0.5">{value}</p>
        {TrendIcon && trend !== undefined && (
          <div className="mt-1.5">
            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="h-3 w-3 shrink-0" />
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground font-normal">{subtitle}</p>
            )}
          </div>
        )}
        {(!TrendIcon || trend === undefined) && subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

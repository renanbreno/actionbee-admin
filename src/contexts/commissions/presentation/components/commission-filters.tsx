"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAffiliateCategories } from "@/contexts/affiliate-categories/presentation/hooks/use-affiliate-categories";

type StatusFilter = "all" | "PENDING" | "PAID" | "CANCELLED";

interface CommissionFiltersProps {
  filters: {
    couponCode: string;
    status: StatusFilter;
    startDate: string;
    endDate: string;
    affiliateCategoryId: string;
  };
  onFiltersChange: (filters: CommissionFiltersProps["filters"]) => void;
}

export function CommissionFilters({
  filters,
  onFiltersChange,
}: CommissionFiltersProps) {
  const { data: affiliateCategories } = useAffiliateCategories();

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Coupon Code — full width on mobile, 1 col on desktop */}
        <div className="col-span-2 lg:col-span-1 space-y-2">
          <Label htmlFor="couponCode" className="text-sm font-medium">
            Código do Cupom
          </Label>
          <Input
            id="couponCode"
            placeholder="Ex: INFLUENCER10"
            value={filters.couponCode}
            onChange={(e) =>
              onFiltersChange({ ...filters, couponCode: e.target.value })
            }
          />
        </div>

        {/* Status + Tipo de Afiliado — side by side always, grouped in 1 desktop col */}
        <div className="col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value as StatusFilter,
                })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="PAID">Pago</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateCategory" className="text-sm font-medium">
              Tipo de Afiliado
            </Label>
            <Select
              value={filters.affiliateCategoryId || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  affiliateCategoryId: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger id="affiliateCategory">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {(affiliateCategories ?? []).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Data Início
          </Label>
          <DatePicker
            value={filters.startDate}
            onChange={(value) =>
              onFiltersChange({ ...filters, startDate: value })
            }
            placeholder="De"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            Data Fim
          </Label>
          <DatePicker
            value={filters.endDate}
            onChange={(value) =>
              onFiltersChange({ ...filters, endDate: value })
            }
            placeholder="Até"
          />
        </div>
      </div>
    </div>
  );
}

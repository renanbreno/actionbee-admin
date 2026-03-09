"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

interface SalesReportFiltersProps {
  filters: {
    representativeName: string;
    startDate: string;
    endDate: string;
  };
  onFiltersChange: (filters: SalesReportFiltersProps["filters"]) => void;
}

export function SalesReportFilters({ filters, onFiltersChange }: SalesReportFiltersProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Representative */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Representante</Label>
          <Input
            type="text"
            placeholder="Buscar por nome"
            value={filters.representativeName}
            onChange={(e) => onFiltersChange({ ...filters, representativeName: e.target.value })}
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Data Início</Label>
          <DatePicker
            value={filters.startDate}
            onChange={(value) => onFiltersChange({ ...filters, startDate: value })}
            placeholder="De"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Data Fim</Label>
          <DatePicker
            value={filters.endDate}
            onChange={(value) => onFiltersChange({ ...filters, endDate: value })}
            placeholder="Até"
          />
        </div>
      </div>
    </div>
  );
}

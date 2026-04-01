"use client";

import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Representative } from "../../domain/entities/representative";
import { RepresentativeSearch } from "./representative-search";

interface SalesReportFiltersProps {
  filters: {
    representativeName: string;
    startDate: string;
    endDate: string;
  };
  selectedRepresentative: Representative | null;
  onFiltersChange: (filters: SalesReportFiltersProps["filters"]) => void;
  onRepresentativeSelect: (representative: Representative) => void;
  onRepresentativeClear: () => void;
}

export function SalesReportFilters({
  filters,
  selectedRepresentative,
  onFiltersChange,
  onRepresentativeSelect,
  onRepresentativeClear,
}: SalesReportFiltersProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Representative */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Representante</Label>
          <RepresentativeSearch
            onSelect={onRepresentativeSelect}
            selected={selectedRepresentative}
            onClear={onRepresentativeClear}
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

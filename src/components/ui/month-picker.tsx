"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface MonthPickerProps {
  value?: string; // "YYYY-MM"
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MonthPicker({
  value,
  onChange,
  placeholder = "Selecione o mês",
  disabled = false,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedYear = value ? parseInt(value.split("-")[0]) : undefined;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : undefined;

  const [viewYear, setViewYear] = React.useState(
    selectedYear ?? new Date().getFullYear(),
  );

  React.useEffect(() => {
    if (selectedYear != null) {
      setViewYear(selectedYear);
    }
  }, [selectedYear]);

  const handleSelect = (monthIndex: number) => {
    const mm = String(monthIndex + 1).padStart(2, "0");
    onChange(`${viewYear}-${mm}`);
    setOpen(false);
  };

  const displayLabel =
    selectedYear != null && selectedMonth != null
      ? `${MONTH_NAMES[selectedMonth]} ${selectedYear}`
      : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-9",
            !displayLabel && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {displayLabel ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        {/* Year navigation */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewYear((y) => y - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">{viewYear}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewYear((y) => y + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Month grid 4×3 */}
        <div className="grid grid-cols-3 gap-1.5">
          {MONTH_NAMES.map((name, i) => {
            const isSelected =
              selectedYear === viewYear && selectedMonth === i;
            return (
              <Button
                key={name}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 text-xs font-medium",
                  isSelected &&
                    "bg-bee-gold text-black hover:bg-bee-amber",
                )}
                onClick={() => handleSelect(i)}
              >
                {name.slice(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

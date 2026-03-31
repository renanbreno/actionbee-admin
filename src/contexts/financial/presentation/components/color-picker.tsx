"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const COLORS = [
  { label: "Nenhuma", value: "" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Laranja", value: "#F97316" },
  { label: "Amarelo", value: "#EAB308" },
  { label: "Verde", value: "#22C55E" },
  { label: "Azul", value: "#3B82F6" },
  { label: "Violeta", value: "#8B5CF6" },
  { label: "Cinza", value: "#6B7280" },
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color) => {
        const isSelected = value === color.value;
        const isEmpty = color.value === "";

        return (
          <button
            key={color.value || "none"}
            type="button"
            title={color.label}
            onClick={() => onChange(color.value)}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              isEmpty && "border-dashed border-muted-foreground/40",
              !isEmpty && !isSelected && "border-transparent hover:border-muted-foreground/30 hover:scale-110",
              isSelected && !isEmpty && "border-foreground ring-2 ring-foreground/20 scale-110",
            )}
            style={isEmpty ? {} : { backgroundColor: color.value }}
          >
            {isEmpty && (
              <span className="text-muted-foreground text-xs leading-none">✕</span>
            )}
            {isSelected && !isEmpty && (
              <Check className="h-4 w-4 text-white drop-shadow-sm" strokeWidth={3} />
            )}
          </button>
        );
      })}
    </div>
  );
}

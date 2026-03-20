"use client";

import { ImageIcon, Table2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { StorySectionType } from "@/contexts/products/domain/entities/story-section";

const sectionTypes: { type: StorySectionType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "text_image", label: "Texto + Imagem", icon: ImageIcon },
  { type: "comparison_table", label: "Tabela Comparativa", icon: Table2 },
  { type: "statistics", label: "Estatísticas", icon: BarChart3 },
];

interface SectionTypePickerProps {
  onSelect: (type: StorySectionType) => void;
}

export function SectionTypePicker({ onSelect }: SectionTypePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Adicionar seção
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          {sectionTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm hover:bg-accent min-h-[44px]"
              onClick={() => {
                onSelect(type);
                setOpen(false);
              }}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

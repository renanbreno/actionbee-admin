"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { representativesApiClient } from "../../infrastructure/api/representatives-api.client";
import { Representative } from "../../domain/entities/representative";

interface RepresentativeSearchProps {
  onSelect: (representative: Representative) => void;
  selected: Representative | null;
  onClear: () => void;
}

export function RepresentativeSearch({
  onSelect,
  selected,
  onClear,
}: RepresentativeSearchProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["representatives-search", debouncedSearch],
    queryFn: () => representativesApiClient.getAll(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{selected.name}</p>
            <p className="text-xs text-muted-foreground">{selected.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar representante por nome..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="pl-9"
        />
      </div>
      {open && debouncedSearch.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
          )}
          {!isLoading && (!data || data.length === 0) && (
            <p className="p-3 text-sm text-muted-foreground">
              Nenhum representante encontrado.
            </p>
          )}
          {data?.map((rep) => (
            <button
              key={rep.id}
              className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
              onMouseDown={() => {
                onSelect(rep);
                setSearch("");
                setOpen(false);
              }}
            >
              <p className="font-medium">{rep.name}</p>
              <p className="text-xs text-muted-foreground">{rep.email}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

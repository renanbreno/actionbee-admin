"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissionsCatalog } from "../hooks/use-roles";
import { Role } from "../../domain/types";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSubmit: (data: {
    name: string;
    description?: string;
    permissions: string[];
  }) => void;
  isSubmitting: boolean;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  isSubmitting,
}: RoleFormDialogProps) {
  const { data: catalog = [] } = usePermissionsCatalog();
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(role?.permissions ?? []),
  );

  const allKeys = useMemo(
    () => catalog.flatMap((group) => group.permissions.map((p) => p.key)),
    [catalog],
  );

  function togglePermission(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleGroup(keys: string[], checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      keys.forEach((key) => (checked ? next.add(key) : next.delete(key)));
      return next;
    });
  }

  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));

  function handleSubmit() {
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      permissions: Array.from(selected),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? "Editar Cargo" : "Novo Cargo"}</DialogTitle>
          <DialogDescription>
            Defina o nome e selecione as permissões deste cargo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-name">Nome</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Operador de Pedidos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">Descrição (opcional)</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Para que serve este cargo"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Permissões</Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleGroup(allKeys, !allSelected)}
              >
                {allSelected ? "Desmarcar todas" : "Marcar todas"}
              </button>
            </div>

            <ScrollArea className="h-72 rounded-md border p-3">
              <div className="space-y-4">
                {catalog.map((group) => {
                  const groupKeys = group.permissions.map((p) => p.key);
                  const groupAllSelected = groupKeys.every((k) =>
                    selected.has(k),
                  );
                  return (
                    <div key={group.resource} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`group-${group.resource}`}
                          checked={groupAllSelected}
                          onCheckedChange={(checked) =>
                            toggleGroup(groupKeys, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`group-${group.resource}`}
                          className="text-sm font-semibold"
                        >
                          {group.label}
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pl-6 sm:grid-cols-2">
                        {group.permissions.map((permission) => (
                          <label
                            key={permission.key}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Checkbox
                              checked={selected.has(permission.key)}
                              onCheckedChange={() =>
                                togglePermission(permission.key)
                              }
                            />
                            {permission.description}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || name.trim().length === 0}
          >
            {role ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

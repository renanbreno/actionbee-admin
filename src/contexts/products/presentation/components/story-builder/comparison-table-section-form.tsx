"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoryImageUpload } from "./story-image-upload";
import type { ProductFormValues } from "../../schemas/product.schema";

interface ComparisonTableSectionFormProps {
  index: number;
}

export function ComparisonTableSectionForm({ index }: ComparisonTableSectionFormProps) {
  const { register, watch, setValue, control } = useFormContext<ProductFormValues>();
  const basePath = `storySections.${index}.data` as const;

  const { fields: rows, append: appendRow, remove: removeRow } = useFieldArray({
    control,
    name: `${basePath}.rows` as any,
  });

  const leftImageUrl = watch(`${basePath}.leftImageUrl` as any);
  const rightImageUrl = watch(`${basePath}.rightImageUrl` as any);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Ex: Por que escolher a LIQUIDZ?"
            {...register(`${basePath}.title` as any)}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo (opcional)</Label>
          <Input
            placeholder="Subtítulo da tabela"
            {...register(`${basePath}.subtitle` as any)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StoryImageUpload
          label="Logo esquerdo (opcional)"
          value={leftImageUrl}
          onChange={(url) => setValue(`${basePath}.leftImageUrl` as any, url ?? "")}
        />
        <StoryImageUpload
          label="Logo direito (opcional)"
          value={rightImageUrl}
          onChange={(url) => setValue(`${basePath}.rightImageUrl` as any, url ?? "")}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>
            Linhas da tabela <span className="text-destructive">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendRow({
                label: "",
                leftValue: "",
                rightValue: "",
                leftType: "boolean",
                rightType: "boolean",
              })
            }
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Linha
          </Button>
        </div>

        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div
              key={row.id}
              className="rounded-lg border p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Linha {rowIndex + 1}
                </span>
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <Input
                placeholder="Critério (ex: Zero açúcar)"
                {...register(`${basePath}.rows.${rowIndex}.label` as any)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={watch(`${basePath}.rows.${rowIndex}.leftType` as any) ?? "boolean"}
                      onValueChange={(v) =>
                        setValue(`${basePath}.rows.${rowIndex}.leftType` as any, v)
                      }
                    >
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boolean">Sim/Não</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                      </SelectContent>
                    </Select>
                    {watch(`${basePath}.rows.${rowIndex}.leftType` as any) === "boolean" ? (
                      <Select
                        value={watch(`${basePath}.rows.${rowIndex}.leftValue` as any) ?? "true"}
                        onValueChange={(v) =>
                          setValue(`${basePath}.rows.${rowIndex}.leftValue` as any, v)
                        }
                      >
                        <SelectTrigger className="flex-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">✓ Sim</SelectItem>
                          <SelectItem value="false">✗ Não</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        className="flex-1 h-8 text-xs"
                        placeholder="Valor"
                        {...register(`${basePath}.rows.${rowIndex}.leftValue` as any)}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={watch(`${basePath}.rows.${rowIndex}.rightType` as any) ?? "boolean"}
                      onValueChange={(v) =>
                        setValue(`${basePath}.rows.${rowIndex}.rightType` as any, v)
                      }
                    >
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boolean">Sim/Não</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                      </SelectContent>
                    </Select>
                    {watch(`${basePath}.rows.${rowIndex}.rightType` as any) === "boolean" ? (
                      <Select
                        value={watch(`${basePath}.rows.${rowIndex}.rightValue` as any) ?? "false"}
                        onValueChange={(v) =>
                          setValue(`${basePath}.rows.${rowIndex}.rightValue` as any, v)
                        }
                      >
                        <SelectTrigger className="flex-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">✓ Sim</SelectItem>
                          <SelectItem value="false">✗ Não</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        className="flex-1 h-8 text-xs"
                        placeholder="Valor"
                        {...register(`${basePath}.rows.${rowIndex}.rightValue` as any)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

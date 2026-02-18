# Padrões UI - ActionBee Admin

## Botões de Ação em Tabelas / Cards

### Padrão: Dropdown de 3 pontinhos (`MoreHorizontal`)

Todas as tabelas e cards usam um único botão `ghost` com ícone `MoreHorizontal` que abre um `DropdownMenu`. **Nunca usar múltiplos botões de ícone individuais na coluna de ações.**

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function RowActions({ onEdit, onDelete, onActivate, onDeactivate, isActive, isPending }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Editar
          </DropdownMenuItem>
        )}
        {onActivate && !isActive && (
          <DropdownMenuItem onClick={onActivate}>
            <CheckCircle className="mr-2 h-3.5 w-3.5" />
            Ativar
          </DropdownMenuItem>
        )}
        {onDeactivate && isActive && (
          <DropdownMenuItem onClick={onDeactivate}>
            <XCircle className="mr-2 h-3.5 w-3.5" />
            Desativar
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Regras:**
- Botão trigger: `variant="ghost" size="icon" className="h-8 w-8 shrink-0"`
- Menu: `align="end" className="w-44"`
- Ícones nos itens: `className="mr-2 h-3.5 w-3.5"`
- Ação destrutiva (excluir/cancelar): sempre por último, separada por `<DropdownMenuSeparator />`, com `className="text-destructive focus:text-destructive"`
- Extrair como componente `XxxActions` reutilizado em card mobile e row desktop
- Se a ação não existe (ex: cupom expirado), retornar `null`

### Coluna de ações na tabela desktop
```tsx
<TableHead className="w-[50px] text-right">Ações</TableHead>
// ...
<TableCell className="text-right">
  <RowActions ... />
</TableCell>
```

### FAB no mobile (páginas com criação)
Páginas que têm botão "Novo X" usam:
- **Desktop**: botão normal no header (`hidden md:flex`)
- **Mobile**: FAB fixo no canto inferior direito (`fixed bottom-6 right-6 z-50 md:hidden`)

```tsx
{/* Desktop */}
<Button className="hidden md:flex h-9 bg-bee-gold text-black hover:bg-bee-amber">
  <Plus className="mr-1.5 h-4 w-4" />
  Novo item
</Button>

{/* Mobile FAB */}
<button
  onClick={() => setCreateOpen(true)}
  className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg active:scale-95 transition-transform md:hidden"
  aria-label="Novo item"
>
  <Plus className="h-6 w-6" />
</button>
```

---

## Formulários e Dialogs

### Stack de formulário (sem shadcn/ui form)
O projeto **não usa** o componente `form` do shadcn. Usar `react-hook-form` diretamente:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Campos Obrigatórios
```tsx
<Label htmlFor="field">
  Nome do Campo <span className="text-destructive">*</span>
</Label>
```

### Campos Opcionais
```tsx
<Label htmlFor="field">
  Nome do Campo{" "}
  <span className="text-muted-foreground/60 font-normal">(opcional)</span>
</Label>
```

### Tooltips Informativos
- Usar `cursor-pointer` (não `cursor-help`)
```tsx
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<div className="flex items-center gap-1.5">
  <Label htmlFor="fieldName">Nome do Campo</Label>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">Descrição do campo.</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
```

### Labels Monetários
- **NÃO** incluir símbolo de moeda (R$) nas labels — usar no placeholder
```tsx
// ❌ ERRADO
<Label>Valor (R$)</Label>

// ✅ CERTO
<Label>Valor mínimo do pedido</Label>
<Input placeholder="Ex: 150.00" />
```

### Estrutura Completa de Campo
```tsx
<div className="space-y-2">
  <Label htmlFor="fieldName">
    Nome do Campo <span className="text-destructive">*</span>
  </Label>
  <Input id="fieldName" placeholder="Ex: exemplo" {...register("fieldName")} />
  {errors.fieldName && (
    <p className="text-destructive text-sm">{errors.fieldName.message}</p>
  )}
</div>
```

### Mensagens de Erro
```tsx
{errors.fieldName && (
  <p className="text-destructive text-sm">{errors.fieldName.message}</p>
)}
```

### Dialogs
- Mobile: full-screen — `className="w-full max-w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto"`
- Botões de ação: `flex-col-reverse` no mobile, `flex-row justify-end` no desktop
```tsx
<div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
  <Button variant="outline" className="w-full sm:w-auto">Cancelar</Button>
  <Button className="w-full bg-bee-gold text-black hover:bg-bee-amber sm:w-auto">Salvar</Button>
</div>
```

---

## Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox";
<div className="flex items-center space-x-2">
  <Checkbox id="terms" {...register("terms")} />
  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
    Eu aceito os termos <span className="text-destructive">*</span>
  </Label>
</div>
{errors.terms && <p className="text-destructive text-sm">{errors.terms.message}</p>}
```

---

## Responsividade

### Grid padrão
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* campos */}
</div>
```

### Layout mobile-first para tabelas
- Mobile (`md:hidden`): lista de cards com informações empilhadas
- Desktop (`hidden md:block`): tabela com colunas

---

## Acessibilidade

- Todos os inputs devem ter `id` correspondente ao `htmlFor` do Label
- Placeholders devem dar exemplos claros do formato esperado

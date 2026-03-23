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

type CheckoutStepFilter = "all" | "CART" | "CHECKOUT" | "PAYMENT";

interface AbandonedCartsFiltersProps {
  filters: {
    search: string;
    checkoutStep: CheckoutStepFilter;
    startDate: string;
    endDate: string;
  };
  onFiltersChange: (filters: AbandonedCartsFiltersProps["filters"]) => void;
}

export function AbandonedCartsFilters({ filters, onFiltersChange }: AbandonedCartsFiltersProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Buscar
          </Label>
          <Input
            id="search"
            placeholder="Nome, email ou telefone..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Checkout Step */}
        <div className="space-y-2">
          <Label htmlFor="checkoutStep" className="text-sm font-medium">
            Step do Checkout
          </Label>
          <Select
            value={filters.checkoutStep}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, checkoutStep: value as CheckoutStepFilter })
            }
          >
            <SelectTrigger id="checkoutStep">
              <SelectValue placeholder="Todos os steps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os steps</SelectItem>
              <SelectItem value="CART">Carrinho</SelectItem>
              <SelectItem value="CHECKOUT">Checkout</SelectItem>
              <SelectItem value="PAYMENT">Pagamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Data Início
          </Label>
          <DatePicker
            value={filters.startDate}
            onChange={(value) => onFiltersChange({ ...filters, startDate: value })}
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
            onChange={(value) => onFiltersChange({ ...filters, endDate: value })}
            placeholder="Até"
          />
        </div>
      </div>
    </div>
  );
}

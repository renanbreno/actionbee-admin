"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckoutStep } from "../../domain/entities/abandoned-cart.entity";

const CHECKOUT_STEP_CONFIG: Record<CheckoutStep, { label: string; className: string }> = {
  CART: {
    label: "Carrinho",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  CHECKOUT: {
    label: "Checkout",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  PAYMENT: {
    label: "Pagamento",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function CheckoutStepBadge({ step }: { step: string }) {
  const config = CHECKOUT_STEP_CONFIG[step as CheckoutStep] ?? {
    label: step,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}

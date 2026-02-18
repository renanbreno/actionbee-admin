"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Loader2, Truck, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShippingOptionCard } from "./shipping-option-card";
import { useShippingQuotation } from "@/shared/presentation/hooks/use-shipping-quotation";
import type { ShippingOption } from "@/shared/infrastructure/api/shipping/types";
import { cn } from "@/lib/utils";

interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface ShippingOptionsSelectorProps {
  cartItems: CartItem[];
  zipCode: string;
  isAddressLookupPending?: boolean;
  selectedOption: ShippingOption | null;
  onSelectOption: (option: ShippingOption) => void;
  onManualFallback?: () => void;
  className?: string;
}

/**
 * Componente de skeleton para loading
 */
function ShippingOptionSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded" />
              <div className="w-16 h-3 bg-muted rounded" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="w-20 h-4 bg-muted rounded" />
            <div className="w-16 h-3 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShippingOptionsSelector({
  cartItems,
  zipCode,
  isAddressLookupPending = false,
  selectedOption,
  onSelectOption,
  onManualFallback,
  className = "",
}: ShippingOptionsSelectorProps) {
  const [showOptions, setShowOptions] = useState(false);

  const quotation = useShippingQuotation();
  const shippingOptions = quotation.data?.shippingOptions ?? [];

  // Auto-calculate when zipCode is complete (8 digits), address lookup is done, and we have items
  useEffect(() => {
    const digits = zipCode.replace(/\D/g, "");
    const isValidZipCode = digits.length === 8;
    const hasItems = cartItems.length > 0;

    // Reset options when zipCode changes
    if (isValidZipCode) {
      setShowOptions(false);
    }

    // Only calculate if zipCode is valid, address lookup is not pending, and we have items
    if (isValidZipCode && !isAddressLookupPending && hasItems) {
      quotation.mutate({
        items: cartItems,
        zipCode: digits,
      });
    }
  }, [zipCode, isAddressLookupPending]);

  // Revela opções com delay após sucesso
  useEffect(() => {
    if (quotation.isSuccess && shippingOptions?.length) {
      const timer = setTimeout(() => setShowOptions(true), 100);
      return () => clearTimeout(timer);
    }
    setShowOptions(false);
  }, [quotation.isSuccess, shippingOptions]);

  // Determine which options have special badges
  const cheapestOption =
    shippingOptions.length > 0
      ? shippingOptions.reduce((min, opt) =>
          opt.price < min.price ? opt : min,
        )
      : null;

  // Pré-seleciona a opção mais barata quando as opções carregam
  useEffect(() => {
    if (shippingOptions.length > 0 && !selectedOption && cheapestOption) {
      onSelectOption(cheapestOption);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingOptions.length]);
  const fastestOption =
    shippingOptions.length > 0
      ? shippingOptions.reduce((min, opt) =>
          opt.deliveryTime < min.deliveryTime ? opt : min,
        )
      : null;

  const data = quotation.data;
  const digits = zipCode.replace(/\D/g, "");
  const isValidZipCode = digits.length === 8;
  const hasItems = cartItems.length > 0;
  const shouldCalculate = isValidZipCode && !isAddressLookupPending && hasItems;

  const isLoading = isAddressLookupPending || quotation.isPending;
  const hasAttempted =
    shouldCalculate || quotation.isSuccess || quotation.error;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Loading State */}
      {isLoading && shouldCalculate && (
        <div className="pt-2">
          <ShippingOptionSkeleton />
        </div>
      )}

      {/* Warning when CEP is not complete */}
      {hasAttempted && !isValidZipCode && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Preencha o CEP acima para calcular as opções de frete.
          </p>
        </div>
      )}

      {/* Warning when no items */}
      {hasAttempted && isValidZipCode && !hasItems && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Adicione itens ao carrinho para calcular o frete.
          </p>
        </div>
      )}

      {/* Error State */}
      {quotation.error && !isAddressLookupPending && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              Não foi possível calcular o frete
            </p>
            <p className="text-sm text-destructive/80">
              {quotation.error instanceof Error
                ? quotation.error.message
                : "Tente novamente"}
            </p>
          </div>
          {onManualFallback && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onManualFallback}
              className="shrink-0"
            >
              Preencher manualmente
            </Button>
          )}
        </div>
      )}

      {/* No Options Available */}
      {hasAttempted &&
        !isLoading &&
        !quotation.error &&
        shippingOptions.length === 0 && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900">
            <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Não há opções de frete disponíveis
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                Não foi possível calcular o frete para este CEP. Preencha os
                dados manualmente.
              </p>
            </div>
            {onManualFallback && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onManualFallback}
                className="shrink-0"
              >
                Preencher manualmente
              </Button>
            )}
          </div>
        )}

      {/* Shipping Options List */}
      {!isLoading && !quotation.error && shippingOptions.length > 0 && (
        <div className="space-y-3">
          {/* Banner de frete grátis */}
          {data?.freeShippingEnabled &&
            !data.freeShipping &&
            data.freeShippingMinValue > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/40 dark:border-green-900">
                <Gift className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  Falta{" "}
                  <span className="font-semibold">
                    R${" "}
                    {(data.freeShippingMinValue - data.cartSubtotal).toFixed(2)}
                  </span>{" "}
                  para aplicar{" "}
                  <span className="font-semibold">frete grátis</span>!
                </p>
              </div>
            )}

          {data?.freeShipping && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 border border-green-300 dark:bg-green-900/60 dark:border-green-700">
              <Gift className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Parabéns! Você ganhou frete grátis nesta compra!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {shippingOptions.map((option, index) => (
              <ShippingOptionCard
                key={`${option.carrier}-${option.service}-${option.serviceCode ?? option.price}`}
                option={option}
                selected={
                  selectedOption?.serviceCode === option.serviceCode &&
                  selectedOption?.carrier === option.carrier
                }
                onSelect={() => onSelectOption(option)}
                isCheapest={
                  !data?.freeShipping &&
                  cheapestOption?.serviceCode === option.serviceCode &&
                  cheapestOption?.carrier === option.carrier
                }
                isFastest={
                  !data?.freeShipping &&
                  fastestOption?.serviceCode === option.serviceCode &&
                  fastestOption?.carrier === option.carrier &&
                  option !== cheapestOption
                }
                isFreeShipping={data?.freeShipping ?? false}
                index={index}
                isVisible={showOptions}
              />
            ))}
          </div>

          {/* Manual Fallback Link */}
          {onManualFallback && (
            <button
              type="button"
              onClick={onManualFallback}
              className="text-xs text-muted-foreground hover:text-foreground underline mt-2"
            >
              Preencher dados de frete manualmente
            </button>
          )}
        </div>
      )}
    </div>
  );
}

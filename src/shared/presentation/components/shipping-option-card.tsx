import { Check, Truck, Package, Clock, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShippingOption } from "@/shared/infrastructure/api/shipping/types";

interface ShippingOptionCardProps {
  option: ShippingOption;
  selected: boolean;
  onSelect: () => void;
  isCheapest?: boolean;
  isFastest?: boolean;
  isFreeShipping?: boolean;
  index?: number;
  isVisible?: boolean;
}

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function ShippingOptionCard({
  option,
  selected,
  onSelect,
  isCheapest = false,
  isFastest = false,
  isFreeShipping = false,
  index = 0,
  isVisible = true,
}: ShippingOptionCardProps) {
  const isFree = option.price === 0 || isFreeShipping;
  const hasBadge = isFree || isCheapest || isFastest;

  // Determine icon based on service type
  const isExpress =
    option.service.toLowerCase().includes("express") ||
    option.service.toLowerCase().includes("sedex");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full text-left rounded-lg border-2 transition-all duration-300",
        "hover:shadow-md hover:border-bee-gold/50",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        selected
          ? "border-bee-gold bg-bee-gold/10 ring-1 ring-bee-gold shadow-sm"
          : isFree || isCheapest
          ? "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/40"
          : isFastest
          ? "border-bee-amber bg-bee-amber/5 dark:border-bee-amber/70"
          : "border-border bg-card hover:bg-muted/40",
      )}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Badge de destaque */}
      {hasBadge && (
        <div
          className={cn(
            "absolute -top-2 left-4 px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm",
            isFree
              ? "bg-green-500 text-white"
              : isCheapest
              ? "bg-green-500 text-white"
              : "bg-bee-amber text-black",
          )}
        >
          {isFree ? (
            <>
              <Gift className="w-3 h-3" />
              Frete Grátis
            </>
          ) : isCheapest ? (
            "Mais barato"
          ) : (
            "Mais rápido"
          )}
        </div>
      )}

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3">
          <div className="h-6 w-6 rounded-full bg-bee-gold flex items-center justify-center shadow-sm">
            <Check className="h-3.5 w-3.5 text-black" />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "flex items-center justify-between p-4 gap-3",
          selected ? "pr-10" : ""
        )}
      >
        {/* Icon and carrier info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
              isFree || isCheapest
                ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                : isFastest
                ? "bg-bee-amber/20 text-bee-amber-dark"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isExpress ? (
              <Truck className="w-5 h-5" />
            ) : (
              <Package className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "font-semibold text-sm truncate",
                (isFree || isCheapest) && "text-green-700 dark:text-green-400"
              )}
            >
              {option.carrier}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {option.service}
            </p>
          </div>
        </div>

        {/* Price and delivery time */}
        <div className="text-right shrink-0">
          {isFree && option.originalPrice ? (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(option.originalPrice)}
              </span>
              <span className="text-base font-bold text-green-600 dark:text-green-400">
                Grátis
              </span>
            </div>
          ) : (
            <p
              className={cn(
                "text-base font-bold",
                isFree
                  ? "text-green-600 dark:text-green-400"
                  : isCheapest || isFastest
                  ? "text-foreground"
                  : "text-bee-gold"
              )}
            >
              {isFree ? "Grátis" : formatPrice(option.price)}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              {option.deliveryTime === 1
                ? "1 dia útil"
                : `${option.deliveryTime} dias úteis`}
            </span>
          </div>
        </div>
      </div>

      {/* Original price with discount (when free shipping is applied) */}
      {option.originalPrice &&
        option.originalPrice > option.price &&
        option.price > 0 && (
          <div className="flex items-center gap-2 px-4 pb-3">
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(option.originalPrice)}
            </span>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              {Math.round(
                ((option.originalPrice - option.price) / option.originalPrice) *
                  100
              )}
              % de desconto
            </span>
          </div>
        )}
    </button>
  );
}

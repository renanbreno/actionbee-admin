"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useState, useEffect } from "react";
import { maskCurrency, unmaskCurrency } from "@/shared/utils/masks";

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, "type" | "onChange" | "value"> {
  label?: string;
  error?: string;
  value: number | null | undefined;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  inputClassName?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      error,
      value: propValue,
      onChange,
      placeholder = "R$ 0,00",
      required = false,
      className = "",
      inputClassName = "",
      id,
      ...inputProps
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState("");

    // Sincroniza displayValue quando o valor externo muda (ex: reset do formulário)
    useEffect(() => {
      if (propValue === null || propValue === undefined || propValue === 0) {
        setDisplayValue("");
      } else {
        const cents = Math.round(propValue * 100);
        setDisplayValue(maskCurrency(cents.toString()));
      }
    }, [propValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      // Se está limpando o campo
      if (rawValue === "") {
        setDisplayValue("");
        onChange(0);
        return;
      }

      // Aplica a máscara
      const masked = maskCurrency(rawValue);
      setDisplayValue(masked);

      // Converte para número e envia para o formulário
      const numericValue = unmaskCurrency(masked) / 100;
      onChange(numericValue);
    };

    const handleBlur = () => {
      // Garante que o valor esteja formatado ao perder o foco
      if (displayValue && !displayValue.startsWith("R$")) {
        const masked = maskCurrency(displayValue);
        setDisplayValue(masked);
        onChange(unmaskCurrency(masked) / 100);
      }
    };

    const inputId = id || `currency-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${error ? "border-destructive" : ""} ${inputClassName}`}
            {...inputProps}
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

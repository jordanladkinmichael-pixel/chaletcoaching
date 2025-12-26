"use client";

import React from "react";
import { useCurrencyStore, type Currency } from "@/lib/stores/currency-store";
import { cn } from "@/lib/utils";
import { THEME } from "@/lib/theme";

// Legacy region type for backward compatibility
type LegacyRegion = "EU" | "UK" | "US";

// Map legacy regions to new currency system
const REGION_TO_CURRENCY: Record<LegacyRegion, Currency> = {
  EU: "EUR",
  UK: "GBP",
  US: "USD",
};

const CURRENCY_TO_REGION: Record<Currency, LegacyRegion> = {
  EUR: "EU",
  GBP: "UK",
  USD: "US",
};

interface CurrencyToggleProps {
  // Legacy support: can still accept region props for backward compatibility
  region?: LegacyRegion;
  onChange?: (region: LegacyRegion) => void;
}

export function CurrencyToggle({ region, onChange }: CurrencyToggleProps = {}) {
  const { currency, setCurrency } = useCurrencyStore();

  // If region prop is provided, sync with Zustand store
  React.useEffect(() => {
    if (region && REGION_TO_CURRENCY[region] !== currency) {
      setCurrency(REGION_TO_CURRENCY[region]);
    }
  }, [region, currency, setCurrency]);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    // Call legacy onChange if provided
    if (onChange) {
      onChange(CURRENCY_TO_REGION[newCurrency]);
    }
  };

  const currencies: Array<{ value: Currency; label: string }> = [
    { value: "GBP", label: "GBP" },
    { value: "EUR", label: "EUR" },
    { value: "USD", label: "USD" },
  ];

  // Use region prop if provided, otherwise use Zustand store
  const currentCurrency = region ? REGION_TO_CURRENCY[region] : currency;

  return (
    <div
      className="inline-flex rounded-lg overflow-hidden border"
      style={{ borderColor: THEME.cardBorder }}
    >
      {currencies.map((curr) => (
        <button
          key={curr.value}
          onClick={() => handleCurrencyChange(curr.value)}
          className={cn(
            "px-3 py-2 text-xs md:text-sm font-medium transition-colors",
            currentCurrency === curr.value ? "font-semibold" : "opacity-60 hover:opacity-100"
          )}
          style={{
            background:
              currentCurrency === curr.value ? THEME.primary : "transparent",
            color: currentCurrency === curr.value ? "#050505" : THEME.text,
          }}
        >
          {curr.label}
        </button>
      ))}
    </div>
  );
}


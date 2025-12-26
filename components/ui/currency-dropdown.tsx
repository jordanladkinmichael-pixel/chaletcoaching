"use client";

import React from "react";
import { Select } from "./select";
import { useCurrencyStore, type Currency } from "@/lib/stores/currency-store";

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

interface CurrencyDropdownProps {
  // Legacy support: can still accept region props for backward compatibility
  region?: LegacyRegion;
  onChange?: (region: LegacyRegion) => void;
}

export function CurrencyDropdown({ region, onChange }: CurrencyDropdownProps = {}) {
  const { currency, setCurrency } = useCurrencyStore();

  // If region prop is provided, sync with Zustand store
  React.useEffect(() => {
    if (region && REGION_TO_CURRENCY[region] !== currency) {
      setCurrency(REGION_TO_CURRENCY[region]);
    }
  }, [region, currency, setCurrency]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
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
    <Select
      options={currencies}
      value={currentCurrency}
      onChange={handleCurrencyChange}
      className="w-auto min-w-[80px]"
    />
  );
}


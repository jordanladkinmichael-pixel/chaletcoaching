/**
 * Single source of truth for token packages and rates
 * Token rates: 100 tokens = €1.00 / £0.87 / $1.35
 */

export type ApiPackageId = "STARTER" | "POPULAR" | "PRO" | "ENTERPRISE";
export type UiPackId = "starter" | "momentum" | "elite";
export type Currency = "EUR" | "GBP" | "USD";

// Token rates: 100 tokens = €1.00 / £0.87 / $1.35
export const TOKEN_RATES = {
  EUR: 100,        // 100 tokens per €1
  GBP: 100 / 0.87, // ≈ 114.94 tokens per £1
  USD: 100 / 1.35, // ≈ 74.07 tokens per $1
} as const;

export const TOKEN_PACKS: Array<{
  uiId: UiPackId;
  apiId: Exclude<ApiPackageId, "ENTERPRISE">;
  title: string;
  tokens: number;
  highlight?: boolean;
  microcopy: string;
}> = [
  { 
    uiId: "starter", 
    apiId: "STARTER", 
    title: "Starter Spark", 
    tokens: 10_000,
    microcopy: "For a quick start"
  },
  { 
    uiId: "momentum", 
    apiId: "POPULAR", 
    title: "Momentum Pack", 
    tokens: 20_000, 
    highlight: true,
    microcopy: "Best value for consistency"
  },
  { 
    uiId: "elite", 
    apiId: "PRO", 
    title: "Elite Performance", 
    tokens: 30_000,
    microcopy: "Built for long-term progress"
  },
];

// Quick amount chips (currency-adaptive)
export const QUICK_AMOUNTS: Record<Currency, number[]> = {
  EUR: [50, 100, 200],
  GBP: [45, 90, 180],
  USD: [70, 140, 280],
};

// Helper functions
export function getPackByUiId(uiId: UiPackId) {
  return TOKEN_PACKS.find(p => p.uiId === uiId);
}

export function getPackByApiId(apiId: ApiPackageId) {
  if (apiId === "ENTERPRISE") return null;
  return TOKEN_PACKS.find(p => p.apiId === apiId);
}

/**
 * Calculate tokens from currency amount
 * @param amount - Amount in currency units
 * @param currency - Currency code
 * @returns Tokens (rounded down to nearest 10)
 */
export function calculateTokensFromAmount(amount: number, currency: Currency): number {
  if (amount <= 0) return 0;
  const tokens = amount * TOKEN_RATES[currency];
  // Round down to nearest 10 tokens
  return Math.floor(tokens / 10) * 10;
}

/**
 * Check if rounding was applied
 * @param amount - Amount in currency units
 * @param currency - Currency code
 * @returns true if rounding was applied
 */
export function wasRounded(amount: number, currency: Currency): boolean {
  if (amount <= 0) return false;
  const exactTokens = amount * TOKEN_RATES[currency];
  const roundedTokens = calculateTokensFromAmount(amount, currency);
  return exactTokens !== roundedTokens;
}


// Абстрактная система платежей для будущих интеграций
export interface PaymentProvider {
  name: string;
  createPaymentSession(data: PaymentSessionData): Promise<PaymentSessionResult>;
  verifyPayment(sessionId: string): Promise<PaymentVerificationResult>;
}

export interface PaymentSessionData {
  userId: string;
  amount: number;
  currency: string;
  tokens: number;
  packageName: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResult {
  sessionId: string;
  paymentUrl?: string;
  success: boolean;
  error?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  paid: boolean;
  amount?: number;
  tokens?: number;
  error?: string;
}

export const TOKEN_PACKAGES = {
    STARTER: {
        name: "Starter",
        price: 9,
        tokens: 1000,
    },
    POPULAR: {
        name: "Builder",
        price: 19,
        tokens: 2575,
    },
    PRO: {
        name: "Pro",
        price: 49,
        tokens: 6600,
    },
    ENTERPRISE: {
        name: "Custom",
        price: 0,
        tokens: 0, // calculated dynamically
    },
} as const;

export type TokenPackageId = keyof typeof TOKEN_PACKAGES;

// Валюты
export const SUPPORTED_CURRENCIES = {
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  USD: { symbol: '$', name: 'US Dollar' },
} as const;

export type Currency = keyof typeof SUPPORTED_CURRENCIES;

// Курсы конвертации (базовая валюта - GBP)
const CONVERSION_RATE_EUR = 1.15; // 1 GBP = 1.15 EUR
const CONVERSION_RATE_USD = 1.25; // 1 GBP = 1.25 USD

export function getPackagePrice(id: keyof typeof TOKEN_PACKAGES, currency: Currency): number {
    const basePrice = TOKEN_PACKAGES[id].price;
    
    if (currency === 'GBP') {
        return basePrice;
    } else if (currency === 'EUR') {
        return Math.round(basePrice * CONVERSION_RATE_EUR * 100) / 100;
    } else if (currency === 'USD') {
        return Math.round(basePrice * CONVERSION_RATE_USD * 100) / 100;
    }
    
    return basePrice;
}

// Утилиты для работы с пакетами
export function getTokenPackage(id: TokenPackageId) {
  return TOKEN_PACKAGES[id];
}

export function getAllTokenPackages() {
  return Object.entries(TOKEN_PACKAGES).map(([id, packageData]) => ({
    id: id as TokenPackageId,
    ...packageData,
  }));
}

export function formatPrice(price: number, currency: Currency = 'GBP'): string {
  const { symbol } = SUPPORTED_CURRENCIES[currency];
  return `${symbol}${price.toFixed(2)}`;
}

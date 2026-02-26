/**
 * Currency configuration and formatting.
 * Stored in localStorage so the user's choice persists.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  nameAz: string;
  decimals: number;
  position: "prefix" | "suffix";
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: "AZN", symbol: "\u20BC", name: "Azerbaijani Manat", nameAz: "Az\u0259rbaycan Manat\u0131", decimals: 2, position: "suffix" },
  { code: "USD", symbol: "$", name: "US Dollar", nameAz: "AB\u015E Dollar\u0131", decimals: 2, position: "prefix" },
  { code: "EUR", symbol: "\u20AC", name: "Euro", nameAz: "Avro", decimals: 2, position: "prefix" },
  { code: "GBP", symbol: "\u00A3", name: "British Pound", nameAz: "Britaniya Funtu", decimals: 2, position: "prefix" },
  { code: "TRY", symbol: "\u20BA", name: "Turkish Lira", nameAz: "T\u00FCrk Lir\u0259si", decimals: 2, position: "suffix" },
  { code: "RUB", symbol: "\u20BD", name: "Russian Ruble", nameAz: "Rus Rublu", decimals: 2, position: "suffix" },
  { code: "GEL", symbol: "\u20BE", name: "Georgian Lari", nameAz: "G\u00FCrc\u00FC Larisi", decimals: 2, position: "suffix" },
];

/**
 * Default exchange rates TO AZN (used as a common base for cross-conversion).
 * amount_in_X * rate = amount_in_AZN.
 */
const DEFAULT_RATES_TO_AZN: Record<string, number> = {
  AZN: 1,
  USD: 1.70,
  EUR: 1.85,
  GBP: 2.15,
  TRY: 0.053,
  RUB: 0.019,
  GEL: 0.64,
};

const RATES_KEY = "gc_exchange_rates";

/** Get the current exchange rates (user-customised or defaults). */
export function getExchangeRates(): Record<string, number> {
  if (typeof window === "undefined") return { ...DEFAULT_RATES_TO_AZN };
  try {
    const stored = localStorage.getItem(RATES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, number>;
      // Merge with defaults so new currencies always have a rate
      return { ...DEFAULT_RATES_TO_AZN, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_RATES_TO_AZN };
}

/** Save custom exchange rates to localStorage. */
export function saveExchangeRates(rates: Record<string, number>): void {
  localStorage.setItem(RATES_KEY, JSON.stringify(rates));
}

/** Reset exchange rates to defaults. */
export function resetExchangeRates(): void {
  localStorage.removeItem(RATES_KEY);
}

/**
 * Convert an amount in cents from one currency to the target (base) currency.
 * Conversion goes: fromCurrency → AZN → toCurrency.
 * Uses integer rounding to keep everything in cents.
 */
export function convertCurrency(
  cents: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return cents;
  const rates = getExchangeRates();
  const toAZN = rates[fromCurrency] ?? 1;
  const fromAZN = rates[toCurrency] ?? 1;
  return Math.round((cents * toAZN) / fromAZN);
}

const CURRENCY_KEY = "gc_currency";

export function getSavedCurrency(): string {
  if (typeof window === "undefined") return "AZN";
  return localStorage.getItem(CURRENCY_KEY) ?? "AZN";
}

export function saveCurrency(code: string): void {
  localStorage.setItem(CURRENCY_KEY, code);
}

export function getCurrencyConfig(code: string): CurrencyConfig {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/**
 * Format cents as currency string using the given currency config.
 */
export function formatMoney(cents: number, config: CurrencyConfig): string {
  const abs = Math.abs(cents);
  const value = (abs / Math.pow(10, config.decimals)).toFixed(config.decimals);
  let formatted: string;
  if (config.position === "prefix") {
    formatted = `${config.symbol}${value}`;
  } else {
    formatted = `${value} ${config.symbol}`;
  }
  return cents < 0 ? `-${formatted}` : formatted;
}

/**
 * Display cents as plain decimal (no symbol).
 */
export function centsToPlain(cents: number, config: CurrencyConfig): string {
  return (cents / Math.pow(10, config.decimals)).toFixed(config.decimals);
}

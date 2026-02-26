"use client";

import { useState } from "react";
import { useTranslations, useLang, type Lang } from "@/lib/i18n";
import { CURRENCIES, getSavedCurrency, saveCurrency, getExchangeRates, saveExchangeRates, resetExchangeRates } from "@/lib/currencies";

interface SettingsPanelProps {
  onBaseCurrencyChange?: () => void;
}

export function SettingsPanel({ onBaseCurrencyChange }: SettingsPanelProps) {
  const t = useTranslations();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState(getSavedCurrency);
  const [rates, setRates] = useState<Record<string, number>>(getExchangeRates);

  function handleLangChange(newLang: Lang) {
    setLang(newLang);
  }

  function handleBaseCurrencyChange(code: string) {
    setBaseCurrency(code);
    saveCurrency(code);
    onBaseCurrencyChange?.();
  }

  function handleRateChange(code: string, value: string) {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;
    const next = { ...rates, [code]: num };
    setRates(next);
    saveExchangeRates(next);
    onBaseCurrencyChange?.();
  }

  function handleResetRates() {
    resetExchangeRates();
    setRates(getExchangeRates());
    onBaseCurrencyChange?.();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label={t.settings}
        className="fixed top-4 right-16 z-50 rounded-full p-2.5 bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-lg backdrop-blur-sm hover:scale-110 transition-transform"
      >
        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl w-full max-w-sm mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
          {t.settings}
        </h2>

        {/* Language */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {t.language}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleLangChange("az")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
                lang === "az"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              Az{"\u0259"}rbaycanca
            </button>
            <button
              onClick={() => handleLangChange("en")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
                lang === "en"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Base Currency */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {t.baseCurrency}
          </label>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">
            {t.baseCurrencyDesc}
          </p>
          <select
            value={baseCurrency}
            onChange={(e) => handleBaseCurrencyChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {lang === "az" ? c.nameAz : c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange Rates */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t.exchangeRates}
            </label>
            <button
              onClick={handleResetRates}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline"
            >
              {t.resetDefaults}
            </button>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
            {t.exchangeRatesDesc}
          </p>
          <div className="space-y-2">
            {CURRENCIES.filter((c) => c.code !== "AZN").map((c) => (
              <div key={c.code} className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-16 shrink-0">
                  1 {c.code}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500">=</span>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={rates[c.code] ?? 1}
                  onChange={(e) => handleRateChange(c.code, e.target.value)}
                  className="flex-1 max-w-[100px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">AZN</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

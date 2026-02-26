import type { Settlement } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import { formatMoney, type CurrencyConfig } from "@/lib/currencies";

interface SettlementListProps {
  settlements: Settlement[];
  currencyConfig: CurrencyConfig;
}

export function SettlementList({ settlements, currencyConfig }: SettlementListProps) {
  const t = useTranslations();

  if (settlements.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-3xl mb-2">&#10003;</div>
        <p className="text-zinc-600 dark:text-zinc-300 font-medium">{t.allSettled}</p>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">{t.noPaymentsNeeded}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {settlements.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4"
        >
          <div className="flex-1">
            <span className="font-medium text-red-600 dark:text-red-400">{s.from_member_name}</span>
            <span className="text-zinc-400 dark:text-zinc-500 mx-2">&rarr;</span>
            <span className="font-medium text-green-600 dark:text-green-400">{s.to_member_name}</span>
          </div>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatMoney(s.amount_cents, currencyConfig)}
          </span>
        </div>
      ))}
      <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center mt-2">
        {t.settlementFooter}
      </p>
    </div>
  );
}

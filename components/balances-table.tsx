import type { MemberBalance } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import { formatMoney, type CurrencyConfig } from "@/lib/currencies";

interface BalancesTableProps {
  balances: MemberBalance[];
  currencyConfig: CurrencyConfig;
}

export function BalancesTable({ balances, currencyConfig }: BalancesTableProps) {
  const t = useTranslations();

  if (balances.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
        {t.noBalances}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="text-left py-3 px-2 font-medium text-zinc-600 dark:text-zinc-400">
              {t.member}
            </th>
            <th className="text-right py-3 px-2 font-medium text-zinc-600 dark:text-zinc-400">
              {t.paid}
            </th>
            <th className="text-right py-3 px-2 font-medium text-zinc-600 dark:text-zinc-400">
              {t.owed}
            </th>
            <th className="text-right py-3 px-2 font-medium text-zinc-600 dark:text-zinc-400">
              {t.net}
            </th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b) => (
            <tr
              key={b.member_id}
              className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            >
              <td className="py-3 px-2 font-medium text-zinc-900 dark:text-zinc-100">
                {b.member_name}
              </td>
              <td className="py-3 px-2 text-right text-zinc-700 dark:text-zinc-300">
                {formatMoney(b.total_paid_cents, currencyConfig)}
              </td>
              <td className="py-3 px-2 text-right text-zinc-700 dark:text-zinc-300">
                {formatMoney(b.total_owed_cents, currencyConfig)}
              </td>
              <td
                className={`py-3 px-2 text-right font-semibold ${
                  b.net_cents > 0
                    ? "text-green-600 dark:text-green-400"
                    : b.net_cents < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {b.net_cents > 0 ? "+" : ""}
                {formatMoney(b.net_cents, currencyConfig)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

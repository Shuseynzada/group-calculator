"use client";

import { useState } from "react";
import { addExpense as addExpenseToStorage } from "@/lib/storage";
import { addExpenseSchema, amountToCents } from "@/lib/schemas";
import type { Member, ExpenseWithParticipants } from "@/lib/types";
import { useTranslations, useLang } from "@/lib/i18n";
import { CURRENCIES, getCurrencyConfig, getSavedCurrency } from "@/lib/currencies";

interface AddExpenseFormProps {
  groupId: string;
  members: Member[];
  onExpenseAdded: (expense: ExpenseWithParticipants) => void;
}

export function AddExpenseForm({
  groupId,
  members,
  onExpenseAdded,
}: AddExpenseFormProps) {
  const t = useTranslations();
  const { lang } = useLang();
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(
    new Set(members.map((m) => m.id))
  );
  const [selectedCurrency, setSelectedCurrency] = useState(getSavedCurrency);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  const currencyConfig = getCurrencyConfig(selectedCurrency);

  function toggleParticipant(memberId: string) {
    setSelectedParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedParticipants(new Set(members.map((m) => m.id)));
  }

  function selectNone() {
    setSelectedParticipants(new Set());
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const raw = {
      group_id: groupId,
      title: formData.get("title") as string,
      amount: formData.get("amount") as string,
      paid_by_member_id: formData.get("paid_by_member_id") as string,
      participant_ids: Array.from(selectedParticipants),
    };

    const parsed = addExpenseSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    try {
      const expense = addExpenseToStorage(
        groupId,
        parsed.data.title,
        amountToCents(parsed.data.amount),
        parsed.data.paid_by_member_id,
        parsed.data.participant_ids,
        selectedCurrency,
        selectedDate
      );
      onExpenseAdded(expense);
      form.reset();
      setSelectedParticipants(new Set(members.map((m) => m.id)));
      setSelectedDate(new Date().toISOString().slice(0, 10));
    } catch {
      setError(t.failedAddExpense);
    }
  }

  if (members.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
        {t.addAtLeastOneMember}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expense-title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            {t.expenseTitle}
          </label>
          <input
            id="expense-title"
            name="title"
            type="text"
            placeholder={t.expenseTitlePlaceholder}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="expense-amount"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            {t.amount} ({currencyConfig.symbol})
          </label>
          <input
            id="expense-amount"
            name="amount"
            type="text"
            inputMode="decimal"
            required
            placeholder="0.00"
            pattern="^\d+(\.\d{1,2})?$"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Currency and Date row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label
            htmlFor="expense-currency"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            {t.currency}
          </label>
          <select
            id="expense-currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {lang === "az" ? c.nameAz : c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label
            htmlFor="expense-date"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            {t.expenseDate}
          </label>
          <input
            id="expense-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="paid-by"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          {t.paidBy}
        </label>
        <select
          id="paid-by"
          name="paid_by_member_id"
          required
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">{t.selectPayer}</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.splitBetween}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline"
            >
              {t.all}
            </button>
            <button
              type="button"
              onClick={selectNone}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline"
            >
              {t.none}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => {
            const isSelected = selectedParticipants.has(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleParticipant(m.id)}
                className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
        {selectedParticipants.size === 0 && (
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">
            {t.selectParticipant}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={selectedParticipants.size === 0}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {t.addExpense}
      </button>
    </form>
  );
}

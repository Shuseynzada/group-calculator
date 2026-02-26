"use client";

import { useState } from "react";
import type { ExpenseWithParticipants, Member } from "@/lib/types";
import { deleteExpense, updateExpense } from "@/lib/storage";
import { amountToCents } from "@/lib/schemas";
import { useTranslations, useLang } from "@/lib/i18n";
import { formatMoney, centsToPlain, getCurrencyConfig, getSavedCurrency, convertCurrency, CURRENCIES } from "@/lib/currencies";

interface ExpenseListProps {
  expenses: ExpenseWithParticipants[];
  members: Member[];
  onExpenseUpdated: (expense: ExpenseWithParticipants) => void;
  onExpenseDeleted: (expenseId: string) => void;
}

export function ExpenseList({ expenses, members, onExpenseUpdated, onExpenseDeleted }: ExpenseListProps) {
  const t = useTranslations();
  const { lang } = useLang();
  const memberMap = new Map(members.map((m) => [m.id, m.name]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editPayer, setEditPayer] = useState("");
  const [editParticipants, setEditParticipants] = useState<Set<string>>(new Set());
  const [editCurrency, setEditCurrency] = useState("AZN");
  const [editDate, setEditDate] = useState("");

  function startEdit(expense: ExpenseWithParticipants) {
    const expCurrencyConfig = getCurrencyConfig(expense.currency ?? "AZN");
    setEditingId(expense.id);
    setEditTitle(expense.title);
    setEditAmount(centsToPlain(expense.amount_cents, expCurrencyConfig));
    setEditPayer(expense.paid_by_member_id);
    setEditParticipants(new Set(expense.participant_ids));
    setEditCurrency(expense.currency ?? "AZN");
    setEditDate(expense.date ?? new Date(expense.created_at).toISOString().slice(0, 10));
  }

  function saveEdit(expenseId: string) {
    const trimmedTitle = editTitle.trim();
    if (!editAmount || !editPayer || editParticipants.size === 0) return;
    const updated = updateExpense(
      expenseId,
      trimmedTitle,
      amountToCents(editAmount),
      editPayer,
      Array.from(editParticipants),
      editCurrency,
      editDate
    );
    if (updated) onExpenseUpdated(updated);
    setEditingId(null);
  }

  function handleDelete(expenseId: string) {
    if (!confirm(t.deleteExpenseConfirm)) return;
    deleteExpense(expenseId);
    onExpenseDeleted(expenseId);
  }

  function toggleParticipant(memberId: string) {
    setEditParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  }

  if (expenses.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
        {t.noExpenses}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const expCurrency = getCurrencyConfig(expense.currency ?? "AZN");
        const payerName = memberMap.get(expense.paid_by_member_id) ?? "Unknown";
        const participantNames = expense.participant_ids
          .map((id) => memberMap.get(id) ?? "Unknown")
          .sort()
          .join(", ");
        const sharePerPerson =
          expense.participant_ids.length > 0
            ? Math.floor(expense.amount_cents / expense.participant_ids.length)
            : 0;

        if (editingId === expense.id) {
          return (
            <div key={expense.id} className="rounded-lg border border-emerald-300 dark:border-emerald-700 p-4 space-y-3 bg-zinc-50 dark:bg-zinc-800/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={t.expenseTitlePlaceholder}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="min-w-0">
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code} — {lang === "az" ? c.nameAz : c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-w-0">
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full min-w-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <select
                value={editPayer}
                onChange={(e) => setEditPayer(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleParticipant(m.id)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
                      editParticipants.has(m.id)
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(expense.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                  {t.save}
                </button>
                <button onClick={() => setEditingId(null)} className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  {t.cancel}
                </button>
              </div>
            </div>
          );
        }

        return (
          <div
            key={expense.id}
            className="group rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {expense.title || formatMoney(expense.amount_cents, expCurrency)}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {t.paidBy} <span className="font-medium text-zinc-700 dark:text-zinc-300">{payerName}</span>
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  {t.splitBetweenLabel} {participantNames} (
                  {formatMoney(sharePerPerson, expCurrency)}{t.perPerson})
                </p>
              </div>
              <div className="text-right ml-4 shrink-0 flex flex-col items-end gap-1">
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatMoney(expense.amount_cents, expCurrency)}
                  {(expense.currency ?? "AZN") !== getSavedCurrency() && (
                    <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 ml-1">
                      ({formatMoney(
                        convertCurrency(expense.amount_cents, expense.currency ?? "AZN", getSavedCurrency()),
                        getCurrencyConfig(getSavedCurrency())
                      )})
                    </span>
                  )}
                </span>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {expense.date
                    ? new Date(expense.date + "T00:00:00").toLocaleDateString()
                    : new Date(expense.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(expense)}
                    className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 p-1"
                    title={t.edit}
                  >
                    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                    title={t.delete}
                  >
                    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

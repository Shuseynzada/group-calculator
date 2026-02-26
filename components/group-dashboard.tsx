"use client";

import { useState, useCallback, useEffect } from "react";
import type { Member, ExpenseWithParticipants, MemberBalance, Settlement } from "@/lib/types";
import { computeBalances, suggestSettlements } from "@/lib/split";
import { useTranslations } from "@/lib/i18n";
import { getCurrencyConfig, getSavedCurrency, type CurrencyConfig } from "@/lib/currencies";
import { AddMemberForm } from "./add-member-form";
import { MemberList } from "./member-list";
import { AddExpenseForm } from "./add-expense-form";
import { ExpenseList } from "./expense-list";
import { BalancesTable } from "./balances-table";
import { SettlementList } from "./settlement-list";

type Tab = "members" | "expenses" | "balances" | "settlement";

interface GroupDashboardProps {
  groupId: string;
  groupName: string;
  initialMembers: Member[];
  initialExpenses: ExpenseWithParticipants[];
  baseCurrencyVersion?: number;
}

export function GroupDashboard({
  groupId,
  groupName,
  initialMembers,
  initialExpenses,
  baseCurrencyVersion,
}: GroupDashboardProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [expenses, setExpenses] = useState<ExpenseWithParticipants[]>(initialExpenses);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  // Default currency for balances/settlements — always the saved base currency
  const defaultCurrencyConfig: CurrencyConfig = getCurrencyConfig(getSavedCurrency());

  // Recompute balances whenever members, expenses, or base currency change
  useEffect(() => {
    const base = getSavedCurrency();
    const b = computeBalances(members, expenses, base);
    setBalances(b);
    setSettlements(suggestSettlements(b));
  }, [members, expenses, baseCurrencyVersion]);

  const handleMemberAdded = useCallback((member: Member) => {
    setMembers((prev) => [...prev, member]);
  }, []);

  const handleMemberUpdated = useCallback((member: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
  }, []);

  const handleMemberDeleted = useCallback((memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  const handleExpenseAdded = useCallback((expense: ExpenseWithParticipants) => {
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const handleExpenseUpdated = useCallback((expense: ExpenseWithParticipants) => {
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
  }, []);

  const handleExpenseDeleted = useCallback((expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  }, []);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "members", label: t.members, count: members.length },
    { key: "expenses", label: t.expenses, count: expenses.length },
    { key: "balances", label: t.balances },
    { key: "settlement", label: t.settlement },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{groupName}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {t.nMembersNExpenses(members.length, expenses.length)}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-700 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "members" && (
          <>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                {t.addMember}
              </h3>
              <AddMemberForm
                groupId={groupId}
                onMemberAdded={handleMemberAdded}
              />
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                {t.members}
              </h3>
              <MemberList
                members={members}
                onMemberUpdated={handleMemberUpdated}
                onMemberDeleted={handleMemberDeleted}
              />
            </div>
          </>
        )}

        {activeTab === "expenses" && (
          <>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                {t.addExpense}
              </h3>
              <AddExpenseForm
                groupId={groupId}
                members={members}
                onExpenseAdded={handleExpenseAdded}
              />
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                {t.expenses}
              </h3>
              <ExpenseList
                expenses={expenses}
                members={members}
                onExpenseUpdated={handleExpenseUpdated}
                onExpenseDeleted={handleExpenseDeleted}
              />
            </div>
          </>
        )}

        {activeTab === "balances" && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {t.balances}
            </h3>
            <BalancesTable balances={balances} currencyConfig={defaultCurrencyConfig} />
          </div>
        )}

        {activeTab === "settlement" && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {t.optimalSettlements}
            </h3>
            <SettlementList settlements={settlements} currencyConfig={defaultCurrencyConfig} />
          </div>
        )}
      </div>
    </div>
  );
}

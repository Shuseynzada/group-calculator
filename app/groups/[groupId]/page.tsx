"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGroup, getMembers, getExpenses } from "@/lib/storage";
import { GroupDashboard } from "@/components/group-dashboard";
import type { Group, Member, ExpenseWithParticipants } from "@/lib/types";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsPanel } from "@/components/settings-panel";
import { useTranslations } from "@/lib/i18n";

export default function GroupPage() {
  const t = useTranslations();
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<ExpenseWithParticipants[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [baseCurrencyVersion, setBaseCurrencyVersion] = useState(0);

  useEffect(() => {
    const g = getGroup(groupId);
    setGroup(g);
    if (g) {
      setMembers(getMembers(groupId));
      setExpenses(getExpenses(groupId));
    }
    setLoaded(true);
  }, [groupId]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
        <p className="text-zinc-400 dark:text-zinc-500">{t.loading}</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">{t.notFound}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t.groupNotFound}</p>
          <Link
            href="/"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            {t.goHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <ThemeToggle />
      <SettingsPanel onBaseCurrencyChange={() => setBaseCurrencyVersion((v) => v + 1)} />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <a
            href="/"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline"
          >
            {t.backToHome}
          </a>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <GroupDashboard
            groupId={group.id}
            groupName={group.name}
            initialMembers={members}
            initialExpenses={expenses}
            baseCurrencyVersion={baseCurrencyVersion}
          />
        </div>
      </div>
    </div>
  );
}

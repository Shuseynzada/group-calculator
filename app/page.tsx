"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGroups, updateGroup, deleteGroup } from "@/lib/storage";
import type { Group } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsPanel } from "@/components/settings-panel";
import { Logo } from "@/components/logo";
import { useTranslations } from "@/lib/i18n";

export default function HomePage() {
  const t = useTranslations();
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    setGroups(getGroups());
  }, []);

  function startEdit(group: Group, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(group.id);
    setEditName(group.name);
  }

  function saveEdit(groupId: string) {
    const trimmed = editName.trim();
    if (!trimmed) return;
    const updated = updateGroup(groupId, trimmed);
    if (updated) {
      setGroups((prev) => prev.map((g) => (g.id === groupId ? updated : g)));
    }
    setEditingId(null);
  }

  function handleDelete(groupId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(t.deleteGroupConfirm)) return;
    deleteGroup(groupId);
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <ThemeToggle />
      <SettingsPanel />
      <div className="mx-auto max-w-lg px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Logo size={64} />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {t.appName}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            {t.appTagline}
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-10">
          <Link
            href="/groups/new"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t.createNewGroup}
          </Link>
        </div>

        {/* Your Groups */}
        {groups.length > 0 && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
              {t.yourGroups}
            </h2>
            <div className="space-y-2">
              {groups.map((group) =>
                editingId === group.id ? (
                  <div
                    key={group.id}
                    className="flex items-center gap-2 rounded-lg border border-emerald-300 dark:border-emerald-700 p-3 bg-zinc-50 dark:bg-zinc-800/50"
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(group.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className="flex-1 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => saveEdit(group.id)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      {t.save}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                ) : (
                  <div
                    key={group.id}
                    className="group flex items-center justify-between rounded-lg border border-zinc-100 dark:border-zinc-800 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <Link
                      href={`/groups/${group.id}`}
                      className="flex-1 min-w-0"
                    >
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {group.name}
                      </span>
                    </Link>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {new Date(group.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startEdit(group, e)}
                          className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 p-1"
                          title={t.edit}
                        >
                          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={(e) => handleDelete(group.id, e)}
                          className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                          title={t.delete}
                        >
                          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-10 text-center">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
            {t.howItWorks}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <div className="text-2xl mb-2">1</div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{t.step1Title}</p>
              <p className="mt-1 text-xs">{t.step1Desc}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <div className="text-2xl mb-2">2</div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{t.step2Title}</p>
              <p className="mt-1 text-xs">{t.step2Desc}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <div className="text-2xl mb-2">3</div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{t.step3Title}</p>
              <p className="mt-1 text-xs">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

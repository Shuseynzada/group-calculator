"use client";

import { useState } from "react";
import { createGroup } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n";

export default function NewGroupPage() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const name = (new FormData(e.currentTarget).get("name") as string)?.trim();
    if (!name) {
      setError(t.groupNameRequired);
      return;
    }

    try {
      const group = createGroup(name);
      router.push(`/groups/${group.id}`);
    } catch {
      setError(t.failedCreateGroup);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline"
          >
            {t.backToHome}
          </a>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {t.createNewGroup}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            {t.startGroupDesc}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="group-name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                {t.groupNameLabel}
              </label>
              <input
                id="group-name"
                name="name"
                type="text"
                required
                autoFocus
                placeholder={t.groupNamePlaceholder}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              {t.createGroup}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

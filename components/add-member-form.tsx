"use client";

import { useState } from "react";
import { addMember } from "@/lib/storage";
import type { Member } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

interface AddMemberFormProps {
  groupId: string;
  onMemberAdded: (member: Member) => void;
}

export function AddMemberForm({ groupId, onMemberAdded }: AddMemberFormProps) {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const name = new FormData(form).get("name") as string;

    if (!name?.trim()) {
      setError(t.memberNameRequired);
      return;
    }

    try {
      const member = addMember(groupId, name.trim());
      onMemberAdded(member);
      form.reset();
    } catch {
      setError(t.failedAddMember);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <label htmlFor="member-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {t.memberName}
        </label>
        <input
          id="member-name"
          name="name"
          type="text"
          required
          placeholder={t.memberNamePlaceholder}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        {t.addMember}
      </button>
      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
    </form>
  );
}

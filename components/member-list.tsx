"use client";

import { useState } from "react";
import type { Member } from "@/lib/types";
import { updateMember, deleteMember } from "@/lib/storage";
import { useTranslations } from "@/lib/i18n";

interface MemberListProps {
  members: Member[];
  onMemberUpdated: (member: Member) => void;
  onMemberDeleted: (memberId: string) => void;
}

export function MemberList({ members, onMemberUpdated, onMemberDeleted }: MemberListProps) {
  const t = useTranslations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function startEdit(member: Member) {
    setEditingId(member.id);
    setEditName(member.name);
    setError(null);
  }

  function saveEdit(memberId: string) {
    const trimmed = editName.trim();
    if (!trimmed) return;
    const updated = updateMember(memberId, trimmed);
    if (updated) {
      onMemberUpdated(updated);
    }
    setEditingId(null);
    setError(null);
  }

  function handleDelete(memberId: string) {
    if (!confirm(t.deleteMemberConfirm)) return;
    const ok = deleteMember(memberId);
    if (!ok) {
      setError(t.memberHasExpenses);
      return;
    }
    onMemberDeleted(memberId);
    setError(null);
  }

  if (members.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
        {t.noMembers}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {members.map((m) =>
          editingId === m.id ? (
            <div key={m.id} className="inline-flex items-center gap-1 rounded-full border border-emerald-400 dark:border-emerald-600 bg-white dark:bg-zinc-800 px-2 py-0.5">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(m.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                autoFocus
                className="w-24 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none"
              />
              <button
                onClick={() => saveEdit(m.id)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                title={t.save}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                title={t.cancel}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <span
              key={m.id}
              className="group inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              {m.name}
              <button
                onClick={() => startEdit(m)}
                className="opacity-0 group-hover:opacity-100 text-emerald-500 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-opacity ml-0.5"
                title={t.edit}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-opacity"
                title={t.delete}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )
        )}
      </div>
    </div>
  );
}

/**
 * localStorage-based persistence layer.
 * All data is stored client-side — no database required.
 * Amounts are stored as integer cents to avoid floating point issues.
 */

import type { Group, Member, ExpenseWithParticipants } from "./types";

// ── Storage keys ──────────────────────────────────────────────
const GROUPS_KEY = "gc_groups";
const MEMBERS_KEY = "gc_members";
const EXPENSES_KEY = "gc_expenses"; // stores ExpenseWithParticipants[]

// ── Helpers ───────────────────────────────────────────────────
function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function uuid(): string {
  return crypto.randomUUID();
}

// ── Groups ────────────────────────────────────────────────────
export function getGroups(): Group[] {
  return read<Group>(GROUPS_KEY).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getGroup(groupId: string): Group | null {
  return read<Group>(GROUPS_KEY).find((g) => g.id === groupId) ?? null;
}

export function createGroup(name: string): Group {
  const groups = read<Group>(GROUPS_KEY);
  const group: Group = {
    id: uuid(),
    name,
    created_at: new Date().toISOString(),
  };
  groups.push(group);
  write(GROUPS_KEY, groups);
  return group;
}

export function updateGroup(groupId: string, name: string): Group | null {
  const groups = read<Group>(GROUPS_KEY);
  const idx = groups.findIndex((g) => g.id === groupId);
  if (idx === -1) return null;
  groups[idx] = { ...groups[idx], name };
  write(GROUPS_KEY, groups);
  return groups[idx];
}

export function deleteGroup(groupId: string): void {
  // Remove group
  const groups = read<Group>(GROUPS_KEY).filter((g) => g.id !== groupId);
  write(GROUPS_KEY, groups);
  // Remove members belonging to this group
  const members = read<Member>(MEMBERS_KEY).filter((m) => m.group_id !== groupId);
  write(MEMBERS_KEY, members);
  // Remove expenses belonging to this group
  const expenses = read<ExpenseWithParticipants>(EXPENSES_KEY).filter(
    (e) => e.group_id !== groupId
  );
  write(EXPENSES_KEY, expenses);
}

// ── Members ───────────────────────────────────────────────────
export function getMembers(groupId: string): Member[] {
  return read<Member>(MEMBERS_KEY)
    .filter((m) => m.group_id === groupId)
    .sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

export function addMember(groupId: string, name: string): Member {
  const members = read<Member>(MEMBERS_KEY);
  const member: Member = {
    id: uuid(),
    group_id: groupId,
    name,
    created_at: new Date().toISOString(),
  };
  members.push(member);
  write(MEMBERS_KEY, members);
  return member;
}

export function updateMember(memberId: string, name: string): Member | null {
  const members = read<Member>(MEMBERS_KEY);
  const idx = members.findIndex((m) => m.id === memberId);
  if (idx === -1) return null;
  members[idx] = { ...members[idx], name };
  write(MEMBERS_KEY, members);
  return members[idx];
}

export function deleteMember(memberId: string): boolean {
  // Check if member has any expenses (as payer or participant)
  const allExpenses = read<ExpenseWithParticipants>(EXPENSES_KEY);
  const hasExpenses = allExpenses.some(
    (e) =>
      e.paid_by_member_id === memberId ||
      e.participant_ids.includes(memberId)
  );
  if (hasExpenses) return false; // cannot delete — has expenses

  const members = read<Member>(MEMBERS_KEY).filter((m) => m.id !== memberId);
  write(MEMBERS_KEY, members);
  return true;
}

// ── Expenses ──────────────────────────────────────────────────
export function getExpenses(groupId: string): ExpenseWithParticipants[] {
  return read<ExpenseWithParticipants>(EXPENSES_KEY)
    .filter((e) => e.group_id === groupId)
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function addExpense(
  groupId: string,
  title: string,
  amountCents: number,
  paidByMemberId: string,
  participantIds: string[],
  currency: string,
  date: string
): ExpenseWithParticipants {
  const expenses = read<ExpenseWithParticipants>(EXPENSES_KEY);
  const expense: ExpenseWithParticipants = {
    id: uuid(),
    group_id: groupId,
    title,
    amount_cents: amountCents,
    paid_by_member_id: paidByMemberId,
    currency,
    date,
    participant_ids: participantIds,
    created_at: new Date().toISOString(),
  };
  expenses.push(expense);
  write(EXPENSES_KEY, expenses);
  return expense;
}

export function updateExpense(
  expenseId: string,
  title: string,
  amountCents: number,
  paidByMemberId: string,
  participantIds: string[],
  currency: string,
  date: string
): ExpenseWithParticipants | null {
  const expenses = read<ExpenseWithParticipants>(EXPENSES_KEY);
  const idx = expenses.findIndex((e) => e.id === expenseId);
  if (idx === -1) return null;
  expenses[idx] = {
    ...expenses[idx],
    title,
    amount_cents: amountCents,
    paid_by_member_id: paidByMemberId,
    currency,
    date,
    participant_ids: participantIds,
  };
  write(EXPENSES_KEY, expenses);
  return expenses[idx];
}

export function deleteExpense(expenseId: string): void {
  const expenses = read<ExpenseWithParticipants>(EXPENSES_KEY).filter(
    (e) => e.id !== expenseId
  );
  write(EXPENSES_KEY, expenses);
}

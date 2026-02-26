/** Database entity types (all amounts stored as integer cents) */

export interface Group {
  id: string;
  name: string;
  created_at: string;
}

export interface Member {
  id: string;
  group_id: string;
  name: string;
  created_at: string;
}

export interface Expense {
  id: string;
  group_id: string;
  title: string;
  amount_cents: number;
  paid_by_member_id: string;
  currency: string;       // currency code e.g. "AZN", "USD"
  date: string;           // user-selected date ISO string (YYYY-MM-DD)
  created_at: string;
}

export interface ExpenseParticipant {
  expense_id: string;
  member_id: string;
}

/** Expense with joined participant member IDs */
export interface ExpenseWithParticipants extends Expense {
  participant_ids: string[];
}

/** Balance info for a single member (all values in cents) */
export interface MemberBalance {
  member_id: string;
  member_name: string;
  total_paid_cents: number;
  total_owed_cents: number;
  net_cents: number; // positive = creditor, negative = debtor
}

/** A suggested settlement payment */
export interface Settlement {
  from_member_id: string;
  from_member_name: string;
  to_member_id: string;
  to_member_name: string;
  amount_cents: number;
}

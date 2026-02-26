import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(100, "Group name must be 100 characters or less"),
});

export const addMemberSchema = z.object({
  group_id: z.string().uuid("Invalid group ID"),
  name: z
    .string()
    .min(1, "Member name is required")
    .max(100, "Member name must be 100 characters or less"),
});

export const addExpenseSchema = z.object({
  group_id: z.string().uuid("Invalid group ID"),
  title: z
    .string()
    .max(200, "Title must be 200 characters or less")
    .default(""),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Amount must be a positive number" }
    )
    .refine(
      (val) => {
        // Allow up to 2 decimal places
        return /^\d+(\.\d{1,2})?$/.test(val);
      },
      { message: "Amount can have at most 2 decimal places" }
    ),
  paid_by_member_id: z.string().uuid("Select who paid"),
  participant_ids: z
    .array(z.string().uuid())
    .min(1, "Select at least one participant"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type AddExpenseInput = z.infer<typeof addExpenseSchema>;

/**
 * Safely convert a decimal amount string (e.g. "12.50") to integer cents.
 * Uses Math.round to handle floating point precision.
 */
export function amountToCents(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}

/**
 * Convert integer cents to a formatted currency string.
 */
export function centsToDisplay(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Format cents as currency with $ sign.
 */
export function formatCurrency(cents: number): string {
  const abs = Math.abs(cents);
  const formatted = `$${(abs / 100).toFixed(2)}`;
  return cents < 0 ? `-${formatted}` : formatted;
}

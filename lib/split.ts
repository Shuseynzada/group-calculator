import type {
  Member,
  ExpenseWithParticipants,
  MemberBalance,
  Settlement,
} from "./types";
import { convertCurrency, getSavedCurrency } from "./currencies";

/**
 * Compute net balances for all members in a group.
 *
 * For each expense (equal split):
 *   share = floor(amount_cents / participant_count)
 *   remainder = amount_cents - share * participant_count
 *   Each participant owes `share` cents.
 *   The first `remainder` participants (by ID sort) each owe 1 extra cent
 *     to ensure the total owed exactly equals the expense amount.
 *   The payer is credited the full amount.
 *
 * Net = total_paid - total_owed
 *   Positive net -> creditor (others owe them)
 *   Negative net -> debtor (they owe others)
 *
 * All calculations use integer cents to avoid floating point errors.
 */
export function computeBalances(
  members: Member[],
  expenses: ExpenseWithParticipants[],
  baseCurrency?: string
): MemberBalance[] {
  const base = baseCurrency ?? getSavedCurrency();
  const paid = new Map<string, number>();
  const owed = new Map<string, number>();

  for (const m of members) {
    paid.set(m.id, 0);
    owed.set(m.id, 0);
  }

  for (const expense of expenses) {
    const payerId = expense.paid_by_member_id;
    const participantIds = [...expense.participant_ids].sort();
    const count = participantIds.length;

    if (count === 0) continue;

    // Convert expense to base currency so all balances are in a single currency
    const amountBase = convertCurrency(expense.amount_cents, expense.currency ?? "AZN", base);

    paid.set(payerId, (paid.get(payerId) ?? 0) + amountBase);

    const share = Math.floor(amountBase / count);
    const remainder = amountBase - share * count;

    for (let i = 0; i < count; i++) {
      const memberId = participantIds[i];
      const memberShare = share + (i < remainder ? 1 : 0);
      owed.set(memberId, (owed.get(memberId) ?? 0) + memberShare);
    }
  }

  return members.map((m) => {
    const totalPaid = paid.get(m.id) ?? 0;
    const totalOwed = owed.get(m.id) ?? 0;
    return {
      member_id: m.id,
      member_name: m.name,
      total_paid_cents: totalPaid,
      total_owed_cents: totalOwed,
      net_cents: totalPaid - totalOwed,
    };
  });
}

/**
 * Generate the OPTIMAL (minimum number of transactions) settlement plan.
 *
 * Uses a recursive subset-sum approach with bitmask DP:
 * 1. Collect all non-zero net balances.
 * 2. Find the maximum number of disjoint subsets whose elements sum to 0.
 *    Each such subset can be settled internally with (subset_size - 1) transactions.
 *    So total transactions = n - number_of_zero_sum_subsets.
 * 3. Then apply a greedy algorithm within each zero-sum group to produce
 *    the actual payment list.
 *
 * For small group sizes (up to ~20 members with non-zero balances) the
 * bitmask DP is efficient. For larger groups we fall back to pure greedy.
 *
 * All amounts are in integer cents. Totals settle to zero exactly.
 *
 * @example
 * //   Alice: +3000, Bob: -2000, Carol: -1000
 * //   Result: Bob -> Alice $20, Carol -> Alice $10  (2 transactions)
 * //
 * //   Alice: +1000, Bob: -1000, Carol: +2000, Dave: -2000
 * //   Optimal: Bob -> Alice $10, Dave -> Carol $20  (2 transactions, not 3)
 */
export function suggestSettlements(
  balances: MemberBalance[]
): Settlement[] {
  // Collect non-zero balances
  const nonZero = balances
    .filter((b) => b.net_cents !== 0)
    .map((b) => ({
      id: b.member_id,
      name: b.member_name,
      net: b.net_cents,
    }));

  const n = nonZero.length;
  if (n === 0) return [];

  // For large groups, fall back to greedy to avoid exponential runtime
  if (n > 20) {
    return greedySettle(nonZero);
  }

  // ── Bitmask DP to find maximum number of disjoint zero-sum subsets ──
  const full = (1 << n) - 1;

  // Precompute sum for every subset
  const subsetSum = new Int32Array(full + 1);
  for (let mask = 1; mask <= full; mask++) {
    const lsb = mask & -mask;
    const bit = Math.log2(lsb);
    subsetSum[mask] = subsetSum[mask ^ lsb] + nonZero[bit].net;
  }

  // dp[mask] = max number of zero-sum subsets formable from `mask`
  const dp = new Int32Array(full + 1);
  // parent[mask] = a zero-sum submask that was "peeled off" to reach dp[mask]
  const parent = new Int32Array(full + 1).fill(-1);

  for (let mask = 1; mask <= full; mask++) {
    // Try every non-empty submask of `mask`
    let sub = mask;
    while (sub > 0) {
      if (subsetSum[sub] === 0) {
        const rest = mask ^ sub;
        const candidate = dp[rest] + 1;
        if (candidate > dp[mask]) {
          dp[mask] = candidate;
          parent[mask] = sub;
        }
      }
      sub = (sub - 1) & mask;
    }
  }

  // ── Reconstruct groups ──
  const groups: number[][] = [];
  let remaining = full;
  while (remaining > 0) {
    const zeroSubset = parent[remaining];
    if (zeroSubset > 0) {
      // Extract indices from this subset
      const group: number[] = [];
      for (let i = 0; i < n; i++) {
        if (zeroSubset & (1 << i)) group.push(i);
      }
      groups.push(group);
      remaining ^= zeroSubset;
    } else {
      // No zero-sum subset found for remaining — dump all into one group
      const group: number[] = [];
      for (let i = 0; i < n; i++) {
        if (remaining & (1 << i)) group.push(i);
      }
      groups.push(group);
      break;
    }
  }

  // ── Greedy settle within each group ──
  const settlements: Settlement[] = [];
  for (const group of groups) {
    const members = group.map((i) => ({ ...nonZero[i] }));
    settlements.push(...greedySettle(members));
  }

  return settlements;
}

/**
 * Classic greedy settlement: match largest creditor with largest debtor repeatedly.
 */
function greedySettle(
  members: { id: string; name: string; net: number }[]
): Settlement[] {
  const creditors = members
    .filter((m) => m.net > 0)
    .map((m) => ({ ...m }))
    .sort((a, b) => b.net - a.net);
  const debtors = members
    .filter((m) => m.net < 0)
    .map((m) => ({ ...m, net: -m.net }))
    .sort((a, b) => b.net - a.net);

  const settlements: Settlement[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const transfer = Math.min(creditor.net, debtor.net);

    if (transfer > 0) {
      settlements.push({
        from_member_id: debtor.id,
        from_member_name: debtor.name,
        to_member_id: creditor.id,
        to_member_name: creditor.name,
        amount_cents: transfer,
      });
    }

    creditor.net -= transfer;
    debtor.net -= transfer;

    if (creditor.net === 0) ci++;
    if (debtor.net === 0) di++;
  }

  return settlements;
}

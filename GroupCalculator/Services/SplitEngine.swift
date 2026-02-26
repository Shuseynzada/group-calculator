import Foundation

// MARK: - Balance Computation

/// Compute net balances for all members in a group.
/// All calculations use integer cents to avoid floating point errors.
func computeBalances(
    members: [Member],
    expenses: [Expense],
    baseCurrency: String,
    rates: [String: Double]
) -> [MemberBalance] {
    var paid: [String: Int] = [:]
    var owed: [String: Int] = [:]

    for m in members {
        paid[m.id] = 0
        owed[m.id] = 0
    }

    for expense in expenses {
        let participantIds = expense.participantIds.sorted()
        let count = participantIds.count
        guard count > 0 else { continue }

        // Convert expense to base currency
        let amountBase = convertCurrency(
            expense.amountCents,
            from: expense.currency,
            to: baseCurrency,
            rates: rates
        )

        paid[expense.paidByMemberId, default: 0] += amountBase

        let share = amountBase / count
        let remainder = amountBase - share * count

        for i in 0..<count {
            let memberId = participantIds[i]
            let memberShare = share + (i < remainder ? 1 : 0)
            owed[memberId, default: 0] += memberShare
        }
    }

    return members.map { m in
        let totalPaid = paid[m.id] ?? 0
        let totalOwed = owed[m.id] ?? 0
        return MemberBalance(
            memberId: m.id,
            memberName: m.name,
            totalPaidCents: totalPaid,
            totalOwedCents: totalOwed,
            netCents: totalPaid - totalOwed
        )
    }
}

// MARK: - Optimal Settlement (Bitmask DP)

/// Generate the optimal (minimum number of transactions) settlement plan.
///
/// Uses bitmask DP to find the maximum number of disjoint zero-sum subsets.
/// Each such subset settles internally with (size - 1) transactions.
/// Total transactions = n - numberOfZeroSumSubsets.
///
/// Falls back to pure greedy for > 20 non-zero members.
func suggestSettlements(_ balances: [MemberBalance]) -> [Settlement] {
    struct Entry {
        let id: String
        let name: String
        var net: Int
    }

    let nonZero = balances
        .filter { $0.netCents != 0 }
        .map { Entry(id: $0.memberId, name: $0.memberName, net: $0.netCents) }

    let n = nonZero.count
    if n == 0 { return [] }

    // Fallback for large groups
    if n > 20 {
        return greedySettle(nonZero.map { ($0.id, $0.name, $0.net) })
    }

    // ── Bitmask DP ──
    let full = (1 << n) - 1

    // Precompute sum for every subset
    var subsetSum = [Int](repeating: 0, count: full + 1)
    for mask in 1...full {
        let lsb = mask & (-mask)
        let bit = Int(log2(Double(lsb)))
        subsetSum[mask] = subsetSum[mask ^ lsb] + nonZero[bit].net
    }

    // dp[mask] = max number of zero-sum subsets formable from `mask`
    var dp = [Int](repeating: 0, count: full + 1)
    // parent[mask] = a zero-sum submask that was "peeled off" to reach dp[mask]
    var parent = [Int](repeating: -1, count: full + 1)

    for mask in 1...full {
        // Enumerate all non-empty submasks
        var sub = mask
        while sub > 0 {
            if subsetSum[sub] == 0 {
                let rest = mask ^ sub
                let candidate = dp[rest] + 1
                if candidate > dp[mask] {
                    dp[mask] = candidate
                    parent[mask] = sub
                }
            }
            sub = (sub - 1) & mask
        }
    }

    // ── Reconstruct groups ──
    var groups: [[Int]] = []
    var remaining = full
    while remaining > 0 {
        let zeroSubset = parent[remaining]
        if zeroSubset > 0 {
            var group: [Int] = []
            for i in 0..<n {
                if zeroSubset & (1 << i) != 0 { group.append(i) }
            }
            groups.append(group)
            remaining ^= zeroSubset
        } else {
            var group: [Int] = []
            for i in 0..<n {
                if remaining & (1 << i) != 0 { group.append(i) }
            }
            groups.append(group)
            break
        }
    }

    // ── Greedy settle within each group ──
    var settlements: [Settlement] = []
    for group in groups {
        let members = group.map { i in (nonZero[i].id, nonZero[i].name, nonZero[i].net) }
        settlements.append(contentsOf: greedySettle(members))
    }
    return settlements
}

/// Classic greedy settlement: match largest creditor with largest debtor.
private func greedySettle(_ members: [(String, String, Int)]) -> [Settlement] {
    var creditors = members
        .filter { $0.2 > 0 }
        .map { (id: $0.0, name: $0.1, net: $0.2) }
        .sorted { $0.net > $1.net }

    var debtors = members
        .filter { $0.2 < 0 }
        .map { (id: $0.0, name: $0.1, net: -$0.2) }
        .sorted { $0.net > $1.net }

    var settlements: [Settlement] = []
    var ci = 0, di = 0

    while ci < creditors.count && di < debtors.count {
        let transfer = min(creditors[ci].net, debtors[di].net)
        if transfer > 0 {
            settlements.append(Settlement(
                fromMemberId: debtors[di].id,
                fromMemberName: debtors[di].name,
                toMemberId: creditors[ci].id,
                toMemberName: creditors[ci].name,
                amountCents: transfer
            ))
        }
        creditors[ci].net -= transfer
        debtors[di].net -= transfer
        if creditors[ci].net == 0 { ci += 1 }
        if debtors[di].net == 0 { di += 1 }
    }
    return settlements
}

import SwiftUI

// MARK: - Balances Table

struct BalancesSection: View {
    @EnvironmentObject var store: AppStore

    let balances: [MemberBalance]

    private var t: Translations { store.t }
    private var currencyConfig: CurrencyConfig { getCurrencyConfig(store.baseCurrency) }

    var body: some View {
        if balances.isEmpty {
            Text(t.noBalances)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .italic()
        } else {
            VStack(spacing: 0) {
                // Header row
                HStack {
                    Text(t.member)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text(t.paid)
                        .frame(width: 72, alignment: .trailing)
                    Text(t.owed)
                        .frame(width: 72, alignment: .trailing)
                    Text(t.net)
                        .frame(width: 78, alignment: .trailing)
                }
                .font(.caption.weight(.medium))
                .foregroundColor(.secondary)
                .padding(.bottom, 8)

                Divider()

                ForEach(balances) { b in
                    HStack {
                        Text(b.memberName)
                            .font(.subheadline.weight(.medium))
                            .foregroundColor(.primary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .lineLimit(1)
                        Text(formatMoney(b.totalPaidCents, currencyConfig))
                            .font(.caption)
                            .foregroundColor(.primary.opacity(0.8))
                            .frame(width: 72, alignment: .trailing)
                        Text(formatMoney(b.totalOwedCents, currencyConfig))
                            .font(.caption)
                            .foregroundColor(.primary.opacity(0.8))
                            .frame(width: 72, alignment: .trailing)
                        Text("\(b.netCents > 0 ? "+" : "")\(formatMoney(b.netCents, currencyConfig))")
                            .font(.caption.weight(.semibold))
                            .foregroundColor(
                                b.netCents > 0 ? .green :
                                b.netCents < 0 ? .red :
                                .secondary
                            )
                            .frame(width: 78, alignment: .trailing)
                    }
                    .padding(.vertical, 8)
                    Divider()
                }
            }
        }
    }
}

// MARK: - Settlements

struct SettlementSection: View {
    @EnvironmentObject var store: AppStore

    let settlements: [Settlement]

    private var t: Translations { store.t }
    private var currencyConfig: CurrencyConfig { getCurrencyConfig(store.baseCurrency) }

    var body: some View {
        if settlements.isEmpty {
            VStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.largeTitle)
                    .foregroundColor(.emerald500)
                Text(t.allSettled)
                    .font(.headline)
                    .foregroundColor(.primary)
                Text(t.noPaymentsNeeded)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
        } else {
            VStack(spacing: 10) {
                ForEach(settlements) { s in
                    HStack {
                        HStack(spacing: 4) {
                            Text(s.fromMemberName)
                                .font(.subheadline.weight(.medium))
                                .foregroundColor(.red)
                            Image(systemName: "arrow.right")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(s.toMemberName)
                                .font(.subheadline.weight(.medium))
                                .foregroundColor(.green)
                        }
                        Spacer()
                        Text(formatMoney(s.amountCents, currencyConfig))
                            .font(.headline)
                            .foregroundColor(.primary)
                    }
                    .padding(12)
                    .background(Color(.systemBackground))
                    .cornerRadius(10)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color(.separator).opacity(0.3), lineWidth: 0.5)
                    )
                }
                Text(t.settlementFooter)
                    .font(.caption2)
                    .foregroundColor(.tertiaryText)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
                    .padding(.top, 4)
            }
        }
    }
}

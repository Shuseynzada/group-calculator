import SwiftUI

enum GroupTab: String, CaseIterable {
    case members, expenses, balances, settlement
}

struct GroupDetailView: View {
    @EnvironmentObject var store: AppStore
    let groupId: String

    @State private var members: [Member] = []
    @State private var expenses: [Expense] = []
    @State private var balances: [MemberBalance] = []
    @State private var settlements: [Settlement] = []
    @State private var activeTab: GroupTab = .members
    @State private var groupName: String = ""

    private var t: Translations { store.t }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                headerSection
                tabBar
                tabContent
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.pageBackground)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear(perform: loadData)
        .onChange(of: store.baseCurrency) { _ in recomputeBalances() }
        .onChange(of: store.exchangeRates) { _ in recomputeBalances() }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(groupName)
                .font(.title2.bold())
                .foregroundColor(.primary)
            Text(t.nMembersNExpenses(members.count, expenses.count))
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }

    // MARK: - Tab Bar

    private var tabBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 4) {
                tabButton(.members, label: t.members, count: members.count)
                tabButton(.expenses, label: t.expenses, count: expenses.count)
                tabButton(.balances, label: t.balances)
                tabButton(.settlement, label: t.settlement)
            }
        }
    }

    private func tabButton(_ tab: GroupTab, label: String, count: Int? = nil) -> some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) { activeTab = tab }
        } label: {
            HStack(spacing: 4) {
                Text(label)
                    .font(.subheadline.weight(.medium))
                if let count {
                    Text("\(count)")
                        .font(.caption2.weight(.semibold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(
                            activeTab == tab
                            ? Color.emerald100.opacity(0.8)
                            : Color(.systemGray5)
                        )
                        .foregroundColor(
                            activeTab == tab
                            ? .emerald700
                            : .secondary
                        )
                        .cornerRadius(8)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .foregroundColor(activeTab == tab ? .emerald600 : .secondary)
        }
        .buttonStyle(.plain)
        .overlay(alignment: .bottom) {
            if activeTab == tab {
                Rectangle()
                    .fill(Color.emerald500)
                    .frame(height: 2)
            }
        }
    }

    // MARK: - Tab Content

    @ViewBuilder
    private var tabContent: some View {
        switch activeTab {
        case .members:
            membersTab
        case .expenses:
            expensesTab
        case .balances:
            balancesTab
        case .settlement:
            settlementTab
        }
    }

    // MARK: - Members Tab

    private var membersTab: some View {
        VStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                SectionHeader(title: t.addMember)
                AddMemberSection(groupId: groupId) { member in
                    members.append(member)
                    recomputeBalances()
                }
            }
            .cardStyle()

            VStack(alignment: .leading, spacing: 8) {
                SectionHeader(title: t.members)
                MemberListSection(
                    members: $members,
                    onUpdate: { recomputeBalances() },
                    onDelete: { recomputeBalances() }
                )
            }
            .cardStyle()
        }
    }

    // MARK: - Expenses Tab

    private var expensesTab: some View {
        VStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                SectionHeader(title: t.addExpense)
                AddExpenseSection(groupId: groupId, members: members) { expense in
                    expenses.insert(expense, at: 0)
                    recomputeBalances()
                }
            }
            .cardStyle()

            VStack(alignment: .leading, spacing: 8) {
                SectionHeader(title: t.expenses)
                ExpenseListSection(
                    expenses: $expenses,
                    members: members,
                    onUpdate: { recomputeBalances() },
                    onDelete: { recomputeBalances() }
                )
            }
            .cardStyle()
        }
    }

    // MARK: - Balances Tab

    private var balancesTab: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(title: t.balances)
            BalancesSection(balances: balances)
        }
        .cardStyle()
    }

    // MARK: - Settlement Tab

    private var settlementTab: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(title: t.optimalSettlements)
            SettlementSection(settlements: settlements)
        }
        .cardStyle()
    }

    // MARK: - Data

    private func loadData() {
        if let group = store.getGroups().first(where: { $0.id == groupId }) ?? StorageService.shared.getGroup(groupId) {
            groupName = group.name
        }
        members = store.getMembers(groupId: groupId)
        expenses = store.getExpenses(groupId: groupId)
        recomputeBalances()
    }

    private func recomputeBalances() {
        balances = store.computeBalances(members: members, expenses: expenses)
        settlements = store.suggestSettlements(balances: balances)
    }

    // Helper to access groups directly
    private func getGroups() -> [Group] {
        store.groups
    }
}

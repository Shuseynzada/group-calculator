import SwiftUI

/// Central app state — shared as @EnvironmentObject throughout the view hierarchy.
class AppStore: ObservableObject {
    private let storage = StorageService.shared

    // Settings
    @Published var lang: Lang = .az
    @Published var baseCurrency: String = "AZN"
    @Published var exchangeRates: [String: Double] = defaultRatesToAZN

    // Data
    @Published var groups: [Group] = []

    // Computed
    var t: Translations { getTranslations(lang) }

    init() {
        loadSettings()
        groups = storage.getGroups()
    }

    // MARK: - Settings

    func loadSettings() {
        let s = storage.loadSettings()
        lang = Lang(rawValue: s.lang) ?? .az
        baseCurrency = s.baseCurrency
        if let rates = s.exchangeRates {
            exchangeRates = defaultRatesToAZN.merging(rates) { _, new in new }
        }
    }

    func setLang(_ newLang: Lang) {
        lang = newLang
        persistSettings()
    }

    func setBaseCurrency(_ code: String) {
        baseCurrency = code
        persistSettings()
    }

    func setExchangeRate(code: String, rate: Double) {
        exchangeRates[code] = rate
        persistSettings()
    }

    func resetExchangeRates() {
        exchangeRates = defaultRatesToAZN
        persistSettings()
    }

    private func persistSettings() {
        var s = StorageService.AppSettings()
        s.lang = lang.rawValue
        s.baseCurrency = baseCurrency
        s.exchangeRates = exchangeRates
        storage.saveSettings(s)
    }

    // MARK: - Groups

    func createGroup(name: String) -> Group {
        let group = storage.createGroup(name: name)
        groups = storage.getGroups()
        return group
    }

    @discardableResult
    func updateGroup(_ id: String, name: String) -> Group? {
        let updated = storage.updateGroup(id, name: name)
        groups = storage.getGroups()
        return updated
    }

    func deleteGroup(_ id: String) {
        storage.deleteGroup(id)
        groups = storage.getGroups()
    }

    // MARK: - Members

    func getMembers(groupId: String) -> [Member] {
        storage.getMembers(groupId: groupId)
    }

    func addMember(groupId: String, name: String) -> Member {
        storage.addMember(groupId: groupId, name: name)
    }

    @discardableResult
    func updateMember(_ id: String, name: String) -> Member? {
        storage.updateMember(id, name: name)
    }

    func deleteMember(_ id: String) -> Bool {
        storage.deleteMember(id)
    }

    // MARK: - Expenses

    func getExpenses(groupId: String) -> [Expense] {
        storage.getExpenses(groupId: groupId)
    }

    func addExpense(
        groupId: String,
        title: String,
        amountCents: Int,
        paidByMemberId: String,
        participantIds: [String],
        currency: String,
        date: String
    ) -> Expense {
        storage.addExpense(
            groupId: groupId,
            title: title,
            amountCents: amountCents,
            paidByMemberId: paidByMemberId,
            participantIds: participantIds,
            currency: currency,
            date: date
        )
    }

    @discardableResult
    func updateExpense(
        _ id: String,
        title: String,
        amountCents: Int,
        paidByMemberId: String,
        participantIds: [String],
        currency: String,
        date: String
    ) -> Expense? {
        storage.updateExpense(
            id,
            title: title,
            amountCents: amountCents,
            paidByMemberId: paidByMemberId,
            participantIds: participantIds,
            currency: currency,
            date: date
        )
    }

    func deleteExpense(_ id: String) {
        storage.deleteExpense(id)
    }

    // MARK: - Calculations

    func computeBalances(members: [Member], expenses: [Expense]) -> [MemberBalance] {
        GroupCalculator.computeBalances(
            members: members,
            expenses: expenses,
            baseCurrency: baseCurrency,
            rates: exchangeRates
        )
    }

    func suggestSettlements(balances: [MemberBalance]) -> [Settlement] {
        GroupCalculator.suggestSettlements(balances)
    }
}

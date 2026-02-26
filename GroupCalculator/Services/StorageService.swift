import Foundation

// MARK: - JSON File Storage

/// Persists all app data as JSON files in the app's documents directory.
/// Mirror of the web app's localStorage approach.
class StorageService {
    static let shared = StorageService()

    private let fileManager = FileManager.default
    private let groupsFile = "gc_groups.json"
    private let membersFile = "gc_members.json"
    private let expensesFile = "gc_expenses.json"
    private let settingsFile = "gc_settings.json"

    private var documentsURL: URL {
        fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    // MARK: - Generic Read/Write

    private func read<T: Decodable>(_ filename: String) -> [T] {
        let url = documentsURL.appendingPathComponent(filename)
        guard let data = try? Data(contentsOf: url) else { return [] }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return (try? decoder.decode([T].self, from: data)) ?? []
    }

    private func write<T: Encodable>(_ filename: String, data: [T]) {
        let url = documentsURL.appendingPathComponent(filename)
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = .prettyPrinted
        guard let jsonData = try? encoder.encode(data) else { return }
        try? jsonData.write(to: url, options: .atomic)
    }

    // MARK: - Settings

    struct AppSettings: Codable {
        var lang: String = "az"
        var theme: String = "system"
        var baseCurrency: String = "AZN"
        var exchangeRates: [String: Double]?
    }

    func loadSettings() -> AppSettings {
        let url = documentsURL.appendingPathComponent(settingsFile)
        guard let data = try? Data(contentsOf: url) else { return AppSettings() }
        return (try? JSONDecoder().decode(AppSettings.self, from: data)) ?? AppSettings()
    }

    func saveSettings(_ settings: AppSettings) {
        let url = documentsURL.appendingPathComponent(settingsFile)
        guard let data = try? JSONEncoder().encode(settings) else { return }
        try? data.write(to: url, options: .atomic)
    }

    // MARK: - Groups

    func getGroups() -> [Group] {
        read(groupsFile).sorted { $0.createdAt > $1.createdAt }
    }

    func getGroup(_ id: String) -> Group? {
        let groups: [Group] = read(groupsFile)
        return groups.first { $0.id == id }
    }

    func createGroup(name: String) -> Group {
        var groups: [Group] = read(groupsFile)
        let group = Group(name: name)
        groups.append(group)
        write(groupsFile, data: groups)
        return group
    }

    func updateGroup(_ id: String, name: String) -> Group? {
        var groups: [Group] = read(groupsFile)
        guard let idx = groups.firstIndex(where: { $0.id == id }) else { return nil }
        groups[idx].name = name
        write(groupsFile, data: groups)
        return groups[idx]
    }

    func deleteGroup(_ id: String) {
        let groups: [Group] = read(groupsFile)
        write(groupsFile, data: groups.filter { $0.id != id })
        // Cascade: remove members and expenses of this group
        let members: [Member] = read(membersFile)
        write(membersFile, data: members.filter { $0.groupId != id })
        let expenses: [Expense] = read(expensesFile)
        write(expensesFile, data: expenses.filter { $0.groupId != id })
    }

    // MARK: - Members

    func getMembers(groupId: String) -> [Member] {
        let members: [Member] = read(membersFile)
        return members
            .filter { $0.groupId == groupId }
            .sorted { $0.createdAt < $1.createdAt }
    }

    func addMember(groupId: String, name: String) -> Member {
        var members: [Member] = read(membersFile)
        let member = Member(groupId: groupId, name: name)
        members.append(member)
        write(membersFile, data: members)
        return member
    }

    func updateMember(_ id: String, name: String) -> Member? {
        var members: [Member] = read(membersFile)
        guard let idx = members.firstIndex(where: { $0.id == id }) else { return nil }
        members[idx].name = name
        write(membersFile, data: members)
        return members[idx]
    }

    func deleteMember(_ id: String) -> Bool {
        let expenses: [Expense] = read(expensesFile)
        let hasExpenses = expenses.contains { e in
            e.paidByMemberId == id || e.participantIds.contains(id)
        }
        if hasExpenses { return false }

        let members: [Member] = read(membersFile)
        write(membersFile, data: members.filter { $0.id != id })
        return true
    }

    // MARK: - Expenses

    func getExpenses(groupId: String) -> [Expense] {
        let expenses: [Expense] = read(expensesFile)
        return expenses
            .filter { $0.groupId == groupId }
            .sorted { $0.createdAt > $1.createdAt }
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
        var expenses: [Expense] = read(expensesFile)
        let expense = Expense(
            groupId: groupId,
            title: title,
            amountCents: amountCents,
            paidByMemberId: paidByMemberId,
            currency: currency,
            date: date,
            participantIds: participantIds
        )
        expenses.append(expense)
        write(expensesFile, data: expenses)
        return expense
    }

    func updateExpense(
        _ id: String,
        title: String,
        amountCents: Int,
        paidByMemberId: String,
        participantIds: [String],
        currency: String,
        date: String
    ) -> Expense? {
        var expenses: [Expense] = read(expensesFile)
        guard let idx = expenses.firstIndex(where: { $0.id == id }) else { return nil }
        expenses[idx].title = title
        expenses[idx].amountCents = amountCents
        expenses[idx].paidByMemberId = paidByMemberId
        expenses[idx].participantIds = participantIds
        expenses[idx].currency = currency
        expenses[idx].date = date
        write(expensesFile, data: expenses)
        return expenses[idx]
    }

    func deleteExpense(_ id: String) {
        let expenses: [Expense] = read(expensesFile)
        write(expensesFile, data: expenses.filter { $0.id != id })
    }
}

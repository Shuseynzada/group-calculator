import Foundation

/// All amounts stored as integer cents to avoid floating point issues.

struct Group: Identifiable, Codable, Equatable {
    let id: String
    var name: String
    let createdAt: Date

    init(id: String = UUID().uuidString, name: String, createdAt: Date = Date()) {
        self.id = id
        self.name = name
        self.createdAt = createdAt
    }
}

struct Member: Identifiable, Codable, Equatable {
    let id: String
    let groupId: String
    var name: String
    let createdAt: Date

    init(id: String = UUID().uuidString, groupId: String, name: String, createdAt: Date = Date()) {
        self.id = id
        self.groupId = groupId
        self.name = name
        self.createdAt = createdAt
    }
}

struct Expense: Identifiable, Codable, Equatable {
    let id: String
    let groupId: String
    var title: String
    var amountCents: Int
    var paidByMemberId: String
    var currency: String
    var date: String // YYYY-MM-DD
    var participantIds: [String]
    let createdAt: Date

    init(
        id: String = UUID().uuidString,
        groupId: String,
        title: String,
        amountCents: Int,
        paidByMemberId: String,
        currency: String = "AZN",
        date: String = "",
        participantIds: [String],
        createdAt: Date = Date()
    ) {
        self.id = id
        self.groupId = groupId
        self.title = title
        self.amountCents = amountCents
        self.paidByMemberId = paidByMemberId
        self.currency = currency
        self.date = date.isEmpty ? Self.todayString() : date
        self.participantIds = participantIds
        self.createdAt = createdAt
    }

    static func todayString() -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: Date())
    }
}

struct MemberBalance: Identifiable, Equatable {
    var id: String { memberId }
    let memberId: String
    let memberName: String
    let totalPaidCents: Int
    let totalOwedCents: Int
    let netCents: Int // positive = creditor, negative = debtor
}

struct Settlement: Identifiable, Equatable {
    let id = UUID()
    let fromMemberId: String
    let fromMemberName: String
    let toMemberId: String
    let toMemberName: String
    let amountCents: Int
}

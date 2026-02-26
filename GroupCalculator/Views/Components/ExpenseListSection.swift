import SwiftUI

struct ExpenseListSection: View {
    @EnvironmentObject var store: AppStore
    @Binding var expenses: [Expense]
    let members: [Member]
    var onUpdate: () -> Void
    var onDelete: () -> Void

    @State private var editingId: String?
    @State private var editTitle = ""
    @State private var editAmount = ""
    @State private var editPayer = ""
    @State private var editParticipants: Set<String> = []
    @State private var editCurrency = "AZN"
    @State private var editDate = Date()
    @State private var expenseToDelete: Expense?

    private var t: Translations { store.t }
    private var memberMap: [String: String] {
        Dictionary(uniqueKeysWithValues: members.map { ($0.id, $0.name) })
    }

    var body: some View {
        if expenses.isEmpty {
            Text(t.noExpenses)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .italic()
        } else {
            VStack(spacing: 10) {
                ForEach(expenses) { expense in
                    if editingId == expense.id {
                        editRow(expense)
                    } else {
                        expenseRow(expense)
                    }
                }
            }
        }
    }

    // MARK: - Display Row

    private func expenseRow(_ expense: Expense) -> some View {
        let config = getCurrencyConfig(expense.currency)
        let payerName = memberMap[expense.paidByMemberId] ?? "?"
        let participantNames = expense.participantIds
            .compactMap { memberMap[$0] }
            .sorted()
            .joined(separator: ", ")
        let sharePerPerson = expense.participantIds.count > 0
            ? expense.amountCents / expense.participantIds.count
            : 0

        let baseCfg = getCurrencyConfig(store.baseCurrency)
        let showConverted = expense.currency != store.baseCurrency
        let convertedCents = showConverted
            ? convertCurrency(expense.amountCents, from: expense.currency, to: store.baseCurrency, rates: store.exchangeRates)
            : 0

        return HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text(expense.title.isEmpty ? formatMoney(expense.amountCents, config) : expense.title)
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(.primary)
                Text("\(t.paidBy) \(payerName)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text("\(t.splitBetweenLabel) \(participantNames) (\(formatMoney(sharePerPerson, config))\(t.perPerson))")
                    .font(.caption2)
                    .foregroundColor(.tertiaryText)
                    .lineLimit(2)
            }
            Spacer(minLength: 8)
            VStack(alignment: .trailing, spacing: 4) {
                HStack(spacing: 2) {
                    Text(formatMoney(expense.amountCents, config))
                        .font(.headline)
                        .foregroundColor(.primary)
                    if showConverted {
                        Text("(\(formatMoney(convertedCents, baseCfg)))")
                            .font(.caption2)
                            .foregroundColor(.tertiaryText)
                    }
                }
                Text(expense.date)
                    .font(.caption2)
                    .foregroundColor(.tertiaryText)
                HStack(spacing: 8) {
                    Button {
                        startEdit(expense)
                    } label: {
                        Image(systemName: "pencil")
                            .font(.caption)
                            .foregroundColor(.emerald500)
                    }
                    .buttonStyle(.plain)
                    Button {
                        expenseToDelete = expense
                    } label: {
                        Image(systemName: "trash")
                            .font(.caption)
                            .foregroundColor(.red.opacity(0.7))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(12)
        .background(Color(.systemBackground))
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(.separator).opacity(0.3), lineWidth: 0.5)
        )
        .alert(t.deleteExpenseConfirm, isPresented: Binding(
            get: { expenseToDelete?.id == expense.id },
            set: { if !$0 { expenseToDelete = nil } }
        )) {
            Button(t.cancel, role: .cancel) { expenseToDelete = nil }
            Button(t.delete, role: .destructive) {
                deleteExpense(expense)
            }
        }
    }

    // MARK: - Edit Row

    private func editRow(_ expense: Expense) -> some View {
        VStack(spacing: 10) {
            HStack(spacing: 8) {
                TextField(t.expenseTitlePlaceholder, text: $editTitle)
                    .textFieldStyle(.roundedBorder)
                    .font(.subheadline)
                TextField("0.00", text: $editAmount)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.decimalPad)
                    .font(.subheadline)
                    .frame(maxWidth: 100)
            }
            HStack(spacing: 8) {
                Picker("", selection: $editCurrency) {
                    ForEach(currencies) { c in
                        Text("\(c.symbol) \(c.code)").tag(c.code)
                    }
                }
                .pickerStyle(.menu)
                .labelsHidden()
                DatePicker("", selection: $editDate, displayedComponents: .date)
                    .labelsHidden()
            }
            Picker(t.paidBy, selection: $editPayer) {
                ForEach(members) { m in
                    Text(m.name).tag(m.id)
                }
            }
            .pickerStyle(.menu)
            FlowLayout(spacing: 6) {
                ForEach(members) { m in
                    let isSelected = editParticipants.contains(m.id)
                    Button {
                        if isSelected { editParticipants.remove(m.id) }
                        else { editParticipants.insert(m.id) }
                    } label: {
                        Text(m.name)
                            .font(.caption.weight(.medium))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(isSelected ? Color.emerald600 : Color(.systemGray6))
                            .foregroundColor(isSelected ? .white : .primary)
                            .cornerRadius(16)
                    }
                    .buttonStyle(.plain)
                }
            }
            HStack(spacing: 8) {
                Button(t.save) { saveEdit(expense.id) }
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color.emerald600)
                    .cornerRadius(8)
                Button(t.cancel) { editingId = nil }
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(.secondary)
            }
        }
        .padding(12)
        .background(Color(.systemGray6).opacity(0.5))
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.emerald300, lineWidth: 1)
        )
    }

    // MARK: - Actions

    private func startEdit(_ expense: Expense) {
        editingId = expense.id
        editTitle = expense.title
        let cfg = getCurrencyConfig(expense.currency)
        editAmount = centsToPlain(expense.amountCents, cfg)
        editPayer = expense.paidByMemberId
        editParticipants = Set(expense.participantIds)
        editCurrency = expense.currency

        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd"
        editDate = df.date(from: expense.date) ?? Date()
    }

    private func saveEdit(_ id: String) {
        guard let cents = amountToCents(editAmount) else { return }
        guard !editPayer.isEmpty, !editParticipants.isEmpty else { return }

        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd"
        let dateStr = df.string(from: editDate)

        if let updated = store.updateExpense(
            id,
            title: editTitle.trimmingCharacters(in: .whitespaces),
            amountCents: cents,
            paidByMemberId: editPayer,
            participantIds: Array(editParticipants),
            currency: editCurrency,
            date: dateStr
        ) {
            if let idx = expenses.firstIndex(where: { $0.id == id }) {
                expenses[idx] = updated
            }
            onUpdate()
        }
        editingId = nil
    }

    private func deleteExpense(_ expense: Expense) {
        store.deleteExpense(expense.id)
        expenses.removeAll { $0.id == expense.id }
        expenseToDelete = nil
        onDelete()
    }
}

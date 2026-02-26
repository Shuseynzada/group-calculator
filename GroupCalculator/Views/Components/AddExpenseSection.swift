import SwiftUI

struct AddExpenseSection: View {
    @EnvironmentObject var store: AppStore
    let groupId: String
    let members: [Member]
    var onExpenseAdded: (Expense) -> Void

    @State private var title = ""
    @State private var amountText = ""
    @State private var selectedCurrency = "AZN"
    @State private var selectedDate = Date()
    @State private var selectedPayer = ""
    @State private var selectedParticipants: Set<String> = []
    @State private var error: String?

    private var t: Translations { store.t }

    var body: some View {
        if members.isEmpty {
            Text(t.addAtLeastOneMember)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .italic()
        } else {
            VStack(spacing: 12) {
                // Title + Amount
                HStack(spacing: 10) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(t.expenseTitle)
                            .font(.caption.weight(.medium))
                            .foregroundColor(.secondary)
                        TextField(t.expenseTitlePlaceholder, text: $title)
                            .textFieldStyle(.roundedBorder)
                            .font(.subheadline)
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(t.amount) (\(getCurrencyConfig(selectedCurrency).symbol))")
                            .font(.caption.weight(.medium))
                            .foregroundColor(.secondary)
                        TextField("0.00", text: $amountText)
                            .textFieldStyle(.roundedBorder)
                            .keyboardType(.decimalPad)
                            .font(.subheadline)
                    }
                }

                // Currency + Date
                HStack(spacing: 10) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(t.currency)
                            .font(.caption.weight(.medium))
                            .foregroundColor(.secondary)
                        Picker("", selection: $selectedCurrency) {
                            ForEach(currencies) { c in
                                Text(currencyDisplayName(c, lang: store.lang))
                                    .tag(c.code)
                            }
                        }
                        .pickerStyle(.menu)
                        .labelsHidden()
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        Text(t.expenseDate)
                            .font(.caption.weight(.medium))
                            .foregroundColor(.secondary)
                        DatePicker("", selection: $selectedDate, displayedComponents: .date)
                            .labelsHidden()
                    }
                }

                // Payer
                VStack(alignment: .leading, spacing: 4) {
                    Text(t.paidBy)
                        .font(.caption.weight(.medium))
                        .foregroundColor(.secondary)
                    Picker(t.selectPayer, selection: $selectedPayer) {
                        Text(t.selectPayer).tag("")
                        ForEach(members) { m in
                            Text(m.name).tag(m.id)
                        }
                    }
                    .pickerStyle(.menu)
                }

                // Participants
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(t.splitBetween)
                            .font(.caption.weight(.medium))
                            .foregroundColor(.secondary)
                        Spacer()
                        Button(t.all) { selectedParticipants = Set(members.map(\.id)) }
                            .font(.caption)
                            .foregroundColor(.emerald600)
                        Button(t.none) { selectedParticipants = [] }
                            .font(.caption)
                            .foregroundColor(.emerald600)
                    }
                    FlowLayout(spacing: 6) {
                        ForEach(members) { m in
                            participantChip(m)
                        }
                    }
                    if selectedParticipants.isEmpty {
                        Text(t.selectParticipant)
                            .font(.caption)
                            .foregroundColor(.red)
                    }
                }

                // Error
                if let error {
                    Text(error)
                        .font(.caption)
                        .foregroundColor(.red)
                }

                // Submit
                Button(t.addExpense) { submitExpense() }
                    .buttonStyle(EmeraldButtonStyle())
                    .disabled(selectedParticipants.isEmpty)
                    .opacity(selectedParticipants.isEmpty ? 0.5 : 1)
            }
            .onAppear {
                selectedCurrency = store.baseCurrency
                selectedParticipants = Set(members.map(\.id))
                if selectedPayer.isEmpty, let first = members.first {
                    selectedPayer = first.id
                }
            }
        }
    }

    private func participantChip(_ member: Member) -> some View {
        let isSelected = selectedParticipants.contains(member.id)
        return Button {
            if isSelected {
                selectedParticipants.remove(member.id)
            } else {
                selectedParticipants.insert(member.id)
            }
        } label: {
            Text(member.name)
                .font(.subheadline.weight(.medium))
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.emerald600 : Color(.systemGray6))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(isSelected ? Color.emerald600 : Color(.separator), lineWidth: 1)
                )
        }
        .buttonStyle(.plain)
    }

    private func submitExpense() {
        error = nil
        guard !amountText.isEmpty, let cents = amountToCents(amountText) else {
            error = t.failedAddExpense
            return
        }
        guard !selectedPayer.isEmpty else {
            error = t.selectPayer
            return
        }
        guard !selectedParticipants.isEmpty else { return }

        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd"
        let dateStr = df.string(from: selectedDate)

        let expense = store.addExpense(
            groupId: groupId,
            title: title.trimmingCharacters(in: .whitespaces),
            amountCents: cents,
            paidByMemberId: selectedPayer,
            participantIds: Array(selectedParticipants),
            currency: selectedCurrency,
            date: dateStr
        )
        onExpenseAdded(expense)

        // Reset form
        title = ""
        amountText = ""
        selectedDate = Date()
        selectedParticipants = Set(members.map(\.id))
    }
}

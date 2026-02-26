import SwiftUI

// MARK: - Add Member

struct AddMemberSection: View {
    @EnvironmentObject var store: AppStore
    let groupId: String
    var onMemberAdded: (Member) -> Void

    @State private var name = ""
    @State private var error: String?

    private var t: Translations { store.t }

    var body: some View {
        HStack(spacing: 8) {
            TextField(t.memberNamePlaceholder, text: $name)
                .textFieldStyle(.roundedBorder)
                .submitLabel(.done)
                .onSubmit { addMember() }
            Button(t.addMember) { addMember() }
                .font(.subheadline.weight(.semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color.emerald600)
                .cornerRadius(8)
        }
        if let error {
            Text(error)
                .font(.caption)
                .foregroundColor(.red)
        }
    }

    private func addMember() {
        let trimmed = name.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else {
            error = t.memberNameRequired
            return
        }
        let member = store.addMember(groupId: groupId, name: trimmed)
        onMemberAdded(member)
        name = ""
        error = nil
    }
}

// MARK: - Member List

struct MemberListSection: View {
    @EnvironmentObject var store: AppStore
    @Binding var members: [Member]
    var onUpdate: () -> Void
    var onDelete: () -> Void

    @State private var editingId: String?
    @State private var editName = ""
    @State private var error: String?
    @State private var memberToDelete: Member?

    private var t: Translations { store.t }

    var body: some View {
        if members.isEmpty {
            Text(t.noMembers)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .italic()
        } else {
            if let error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
                    .padding(.vertical, 4)
            }
            FlowLayout(spacing: 8) {
                ForEach(members) { member in
                    if editingId == member.id {
                        editChip(member)
                    } else {
                        memberChip(member)
                    }
                }
            }
        }
    }

    private func memberChip(_ member: Member) -> some View {
        HStack(spacing: 4) {
            Text(member.name)
                .font(.subheadline.weight(.medium))
                .foregroundColor(.emerald700)
            Button {
                editingId = member.id
                editName = member.name
                error = nil
            } label: {
                Image(systemName: "pencil")
                    .font(.system(size: 10))
                    .foregroundColor(.emerald500)
            }
            .buttonStyle(.plain)
            Button {
                memberToDelete = member
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 10))
                    .foregroundColor(.red.opacity(0.7))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(Color.emerald50)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.emerald200, lineWidth: 1)
        )
        .alert(t.deleteMemberConfirm, isPresented: Binding(
            get: { memberToDelete?.id == member.id },
            set: { if !$0 { memberToDelete = nil } }
        )) {
            Button(t.cancel, role: .cancel) { memberToDelete = nil }
            Button(t.delete, role: .destructive) {
                deleteMember(member)
            }
        }
    }

    private func editChip(_ member: Member) -> some View {
        HStack(spacing: 4) {
            TextField("", text: $editName)
                .font(.subheadline)
                .frame(width: 80)
                .textFieldStyle(.roundedBorder)
                .onSubmit { saveEdit(member.id) }
            Button {
                saveEdit(member.id)
            } label: {
                Image(systemName: "checkmark")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.emerald600)
            }
            .buttonStyle(.plain)
            Button {
                editingId = nil
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Color(.systemBackground))
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.emerald400, lineWidth: 1)
        )
    }

    private func saveEdit(_ id: String) {
        let trimmed = editName.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        if let updated = store.updateMember(id, name: trimmed) {
            if let idx = members.firstIndex(where: { $0.id == id }) {
                members[idx] = updated
            }
            onUpdate()
        }
        editingId = nil
    }

    private func deleteMember(_ member: Member) {
        let ok = store.deleteMember(member.id)
        if !ok {
            error = t.memberHasExpenses
            memberToDelete = nil
            return
        }
        members.removeAll { $0.id == member.id }
        memberToDelete = nil
        error = nil
        onDelete()
    }
}

// MARK: - Flow Layout (chip wrapping)

struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = layout(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = layout(proposal: proposal, subviews: subviews)
        for (index, frame) in result.frames.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + frame.minX, y: bounds.minY + frame.minY), proposal: .init(frame.size))
        }
    }

    private func layout(proposal: ProposedViewSize, subviews: Subviews) -> (size: CGSize, frames: [CGRect]) {
        let maxWidth = proposal.width ?? .infinity
        var frames: [CGRect] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for sub in subviews {
            let size = sub.sizeThatFits(.unspecified)
            if x + size.width > maxWidth && x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            frames.append(CGRect(origin: CGPoint(x: x, y: y), size: size))
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }

        return (CGSize(width: maxWidth, height: y + rowHeight), frames)
    }
}

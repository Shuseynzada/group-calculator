import SwiftUI

struct HomeView: View {
    @EnvironmentObject var store: AppStore
    @State private var showSettings = false
    @State private var showNewGroup = false
    @State private var editingGroupId: String?
    @State private var editName = ""
    @State private var groupToDelete: Group?

    private var t: Translations { store.t }

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                heroSection
                ctaButton
                if !store.groups.isEmpty {
                    groupListSection
                }
                howItWorksSection
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 24)
        }
        .background(Color.pageBackground)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { showSettings = true } label: {
                    Image(systemName: "gearshape")
                        .foregroundColor(.secondary)
                }
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
        .sheet(isPresented: $showNewGroup) {
            NewGroupSheet()
        }
        .alert(t.deleteGroupConfirm, isPresented: Binding(
            get: { groupToDelete != nil },
            set: { if !$0 { groupToDelete = nil } }
        )) {
            Button(t.cancel, role: .cancel) { groupToDelete = nil }
            Button(t.delete, role: .destructive) {
                if let g = groupToDelete {
                    store.deleteGroup(g.id)
                    groupToDelete = nil
                }
            }
        }
    }

    // MARK: - Hero

    private var heroSection: some View {
        VStack(spacing: 8) {
            LogoView(size: 64)
            Text(t.appName)
                .font(.largeTitle.bold())
                .foregroundColor(.primary)
            Text(t.appTagline)
                .font(.body)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 16)
    }

    // MARK: - CTA

    private var ctaButton: some View {
        Button {
            showNewGroup = true
        } label: {
            Label(t.createNewGroup, systemImage: "plus")
        }
        .buttonStyle(EmeraldButtonStyle(fullWidth: false))
    }

    // MARK: - Group List

    private var groupListSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: t.yourGroups)

            ForEach(store.groups) { group in
                if editingGroupId == group.id {
                    editGroupRow(group)
                } else {
                    groupRow(group)
                }
            }
        }
        .cardStyle()
    }

    private func groupRow(_ group: Group) -> some View {
        NavigationLink(destination: GroupDetailView(groupId: group.id)) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(group.name)
                        .font(.body.weight(.medium))
                        .foregroundColor(.primary)
                    Text(group.createdAt, style: .date)
                        .font(.caption)
                        .foregroundColor(.tertiaryText)
                }
                Spacer()
                HStack(spacing: 8) {
                    Button {
                        editingGroupId = group.id
                        editName = group.name
                    } label: {
                        Image(systemName: "pencil")
                            .font(.caption)
                            .foregroundColor(.emerald500)
                    }
                    .buttonStyle(.plain)
                    Button {
                        groupToDelete = group
                    } label: {
                        Image(systemName: "trash")
                            .font(.caption)
                            .foregroundColor(.red)
                    }
                    .buttonStyle(.plain)
                }
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundColor(.tertiaryText)
            }
            .padding(.vertical, 6)
        }
        .buttonStyle(.plain)
    }

    private func editGroupRow(_ group: Group) -> some View {
        HStack(spacing: 8) {
            TextField(t.groupNamePlaceholder, text: $editName)
                .textFieldStyle(.roundedBorder)
                .onSubmit { saveGroupEdit(group.id) }
            Button(t.save) { saveGroupEdit(group.id) }
                .font(.caption.bold())
                .foregroundColor(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Color.emerald600)
                .cornerRadius(8)
            Button(t.cancel) { editingGroupId = nil }
                .font(.caption.bold())
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }

    private func saveGroupEdit(_ id: String) {
        let trimmed = editName.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        store.updateGroup(id, name: trimmed)
        editingGroupId = nil
    }

    // MARK: - How It Works

    private var howItWorksSection: some View {
        VStack(spacing: 12) {
            SectionHeader(title: t.howItWorks)
            HStack(alignment: .top, spacing: 12) {
                stepCard("1", title: t.step1Title, desc: t.step1Desc)
                stepCard("2", title: t.step2Title, desc: t.step2Desc)
                stepCard("3", title: t.step3Title, desc: t.step3Desc)
            }
        }
    }

    private func stepCard(_ num: String, title: String, desc: String) -> some View {
        VStack(spacing: 6) {
            Text(num)
                .font(.title2.bold())
                .foregroundColor(.emerald600)
            Text(title)
                .font(.caption.bold())
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
            Text(desc)
                .font(.caption2)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(Color.cardBackground)
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(.separator).opacity(0.3), lineWidth: 0.5)
        )
    }
}

// MARK: - New Group Sheet

struct NewGroupSheet: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var error: String?
    @State private var createdGroup: Group?

    private var t: Translations { store.t }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField(t.groupNamePlaceholder, text: $name)
                } header: {
                    Text(t.groupNameLabel)
                } footer: {
                    if let error {
                        Text(error).foregroundColor(.red)
                    } else {
                        Text(t.startGroupDesc)
                    }
                }
            }
            .navigationTitle(t.createNewGroup)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(t.cancel) { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(t.createGroup) {
                        let trimmed = name.trimmingCharacters(in: .whitespaces)
                        guard !trimmed.isEmpty else {
                            error = t.groupNameRequired
                            return
                        }
                        let group = store.createGroup(name: trimmed)
                        createdGroup = group
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

// MARK: - Logo

struct LogoView: View {
    var size: CGFloat = 48

    var body: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [.emerald400, .emerald600],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: size, height: size)
            Image(systemName: "person.2.fill")
                .font(.system(size: size * 0.35))
                .foregroundColor(.white)
        }
    }
}

import SwiftUI
import PhotosUI

struct EditProfileView: View {
    @Environment(ProfileViewModel.self) private var viewModel
    @Environment(\.dismiss) private var dismiss

    @State private var username: String = ""
    @State private var fullName: String = ""
    @State private var bio: String = ""
    @State private var selectedItem: PhotosPickerItem?
    @State private var error: String?

    var body: some View {
        NavigationStack {
            Form {
                avatarSection
                detailsSection
                bioSection
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .disabled(viewModel.isSaving)
                        .accessibilityLabel("Cancel editing profile")
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveProfile()
                    }
                    .fontWeight(.semibold)
                    .disabled(viewModel.isSaving)
                    .accessibilityLabel("Save profile changes")
                }
            }
            .onAppear(perform: loadCurrentValues)
            .onChange(of: selectedItem) { _, newItem in
                uploadAvatar(from: newItem)
            }
            .overlay {
                if viewModel.isSaving {
                    savingOverlay
                }
            }
        }
    }

    // MARK: - Avatar Section

    private var avatarSection: some View {
        Section {
            HStack {
                Spacer()
                VStack(spacing: Theme.Spacing.sm) {
                    AvatarView(
                        url: viewModel.profile?.avatarUrl,
                        initials: viewModel.profile?.initials ?? "?",
                        size: 80
                    )

                    PhotosPicker(selection: $selectedItem, matching: .images) {
                        Text("Change Photo")
                            .font(Theme.Typography.footnote)
                            .foregroundStyle(Theme.Colors.primary)
                    }
                    .accessibilityLabel("Change profile photo")
                }
                Spacer()
            }
            .listRowBackground(Color.clear)
        }
    }

    // MARK: - Details Section

    private var detailsSection: some View {
        Section("Details") {
            TextField("Username", text: $username)
                .textContentType(.username)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
                .accessibilityLabel("Username")

            TextField("Full Name", text: $fullName)
                .textContentType(.name)
                .accessibilityLabel("Full name")
        }
    }

    // MARK: - Bio Section

    private var bioSection: some View {
        Section("Bio") {
            ZStack(alignment: .topLeading) {
                if bio.isEmpty {
                    Text("Tell us about yourself...")
                        .foregroundStyle(.tertiary)
                        .padding(.top, 8)
                        .accessibilityHidden(true)
                }
                TextEditor(text: $bio)
                    .frame(minHeight: 80)
                    .scrollContentBackground(.hidden)
                    .accessibilityLabel("Bio")
                    .accessibilityHint("Write a short bio about yourself")
            }

            HStack {
                Spacer()
                Text("\(bio.count)/150")
                    .font(Theme.Typography.caption)
                    .foregroundStyle(bio.count > 150 ? .red : .secondary)
            }
        }
    }

    // MARK: - Saving Overlay

    private var savingOverlay: some View {
        ZStack {
            Color.black.opacity(0.2)
                .ignoresSafeArea()
            ProgressView("Saving...")
                .padding(Theme.Spacing.lg)
                .background(.ultraThickMaterial)
                .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))
        }
        .accessibilityLabel("Saving profile changes")
    }

    // MARK: - Actions

    private func loadCurrentValues() {
        guard let profile = viewModel.profile else { return }
        username = profile.username ?? ""
        fullName = profile.fullName ?? ""
        bio = profile.bio ?? ""
    }

    private func saveProfile() {
        Task {
            do {
                try await viewModel.updateProfile(
                    username: username.isEmpty ? nil : username,
                    fullName: fullName.isEmpty ? nil : fullName,
                    bio: bio.isEmpty ? nil : String(bio.prefix(150))
                )
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                dismiss()
            } catch {
                self.error = "Failed to save profile."
                UINotificationFeedbackGenerator().notificationOccurred(.error)
            }
        }
    }

    private func uploadAvatar(from item: PhotosPickerItem?) {
        guard let item else { return }

        Task {
            if let data = try? await item.loadTransferable(type: Data.self) {
                do {
                    try await viewModel.uploadAvatar(imageData: data)
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                } catch {
                    self.error = "Failed to upload photo."
                    UINotificationFeedbackGenerator().notificationOccurred(.error)
                }
            }
        }
    }
}

#Preview {
    EditProfileView()
        .environment(ProfileViewModel())
}

import SwiftUI

struct SettingsView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @Environment(StoreViewModel.self) private var storeViewModel
    @Environment(\.dismiss) private var dismiss
    @AppStorage(Config.Defaults.preferredAppearance) private var appearance = AppearanceMode.system.rawValue
    @AppStorage(Config.Defaults.notificationsEnabled) private var notificationsEnabled = true
    @State private var showPaywall = false
    @State private var showDeleteConfirmation = false
    @State private var showSignOutConfirmation = false
    @State private var subscriptionStatus = "Loading..."

    var body: some View {
        NavigationStack {
            List {
                appearanceSection
                notificationSection
                subscriptionSection
                accountSection
                aboutSection
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                        .accessibilityLabel("Close settings")
                }
            }
            .sheet(isPresented: $showPaywall) {
                PaywallView()
            }
            .alert("Sign Out", isPresented: $showSignOutConfirmation) {
                Button("Sign Out", role: .destructive) {
                    Task { await authViewModel.signOut() }
                    dismiss()
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("Are you sure you want to sign out?")
            }
            .alert("Delete Account", isPresented: $showDeleteConfirmation) {
                Button("Delete", role: .destructive) {
                    Task {
                        try? await authViewModel.deleteAccount()
                        dismiss()
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This will permanently delete your account and all associated data. This action cannot be undone.")
            }
            .task {
                subscriptionStatus = await storeViewModel.subscriptionStatusText()
            }
        }
    }

    // MARK: - Appearance

    private var appearanceSection: some View {
        Section("Appearance") {
            Picker("Theme", selection: $appearance) {
                ForEach(AppearanceMode.allCases, id: \.rawValue) { mode in
                    Text(mode.title).tag(mode.rawValue)
                }
            }
            .accessibilityLabel("App theme")
        }
    }

    // MARK: - Notifications

    private var notificationSection: some View {
        Section("Notifications") {
            Toggle("Push Notifications", isOn: $notificationsEnabled)
                .onChange(of: notificationsEnabled) { _, newValue in
                    if newValue {
                        Task { _ = await NotificationService.shared.requestPermission() }
                    }
                }
                .accessibilityLabel("Enable push notifications")
        }
    }

    // MARK: - Subscription

    private var subscriptionSection: some View {
        Section("Subscription") {
            HStack {
                Label("Status", systemImage: "star.circle")
                Spacer()
                Text(subscriptionStatus)
                    .foregroundStyle(.secondary)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel("Subscription status: \(subscriptionStatus)")

            if !storeViewModel.isPremium {
                Button {
                    showPaywall = true
                } label: {
                    Label("Upgrade to Premium", systemImage: "crown.fill")
                        .foregroundStyle(Theme.Colors.primary)
                }
                .accessibilityLabel("Upgrade to premium subscription")
            }

            Button {
                Task { await storeViewModel.restorePurchases() }
            } label: {
                Label("Restore Purchases", systemImage: "arrow.clockwise")
            }
            .accessibilityLabel("Restore previous purchases")
        }
    }

    // MARK: - Account

    private var accountSection: some View {
        Section("Account") {
            Button {
                showSignOutConfirmation = true
            } label: {
                Label("Sign Out", systemImage: "rectangle.portrait.and.arrow.right")
                    .foregroundStyle(.primary)
            }
            .accessibilityLabel("Sign out of your account")

            Button(role: .destructive) {
                showDeleteConfirmation = true
            } label: {
                Label("Delete Account", systemImage: "trash")
                    .foregroundStyle(.red)
            }
            .accessibilityLabel("Delete your account permanently")
        }
    }

    // MARK: - About

    private var aboutSection: some View {
        Section("About") {
            HStack {
                Label("Version", systemImage: "info.circle")
                Spacer()
                Text("\(Config.appVersion) (\(Config.buildNumber))")
                    .foregroundStyle(.secondary)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel("App version \(Config.appVersion), build \(Config.buildNumber)")

            Link(destination: Config.termsURL) {
                Label("Terms of Service", systemImage: "doc.text")
            }
            .accessibilityLabel("View terms of service")

            Link(destination: Config.privacyURL) {
                Label("Privacy Policy", systemImage: "hand.raised")
            }
            .accessibilityLabel("View privacy policy")

            Link(destination: URL(string: "mailto:\(Config.supportEmail)")!) {
                Label("Contact Support", systemImage: "envelope")
            }
            .accessibilityLabel("Contact support via email")
        }
    }
}

// MARK: - Appearance Mode

enum AppearanceMode: String, CaseIterable {
    case system
    case light
    case dark

    var title: String {
        switch self {
        case .system: return "System"
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}

#Preview {
    SettingsView()
        .environment(AuthViewModel())
        .environment(StoreViewModel())
}

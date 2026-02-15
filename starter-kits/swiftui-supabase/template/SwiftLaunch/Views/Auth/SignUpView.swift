import SwiftUI
import AuthenticationServices

struct SignUpView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var localError: String?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing.xl) {
                    headerSection
                    formSection
                    dividerSection
                    appleSignInSection
                    termsSection
                }
                .padding(.horizontal, Theme.Spacing.lg)
                .padding(.top, Theme.Spacing.xl)
            }
            .navigationTitle("Create Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .accessibilityLabel("Cancel sign up")
                }
            }
            .alert("Check Your Email", isPresented: .init(
                get: { authViewModel.showEmailVerification },
                set: { if !$0 { authViewModel.showEmailVerification = false; dismiss() } }
            )) {
                Button("OK") { dismiss() }
            } message: {
                Text("We sent a verification link to \(email). Please verify your email to sign in.")
            }
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(spacing: Theme.Spacing.sm) {
            Image(systemName: "person.badge.plus")
                .font(.system(size: 48))
                .foregroundStyle(Theme.Colors.primary)
                .accessibilityHidden(true)

            Text("Get started for free")
                .font(Theme.Typography.body)
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Form

    private var formSection: some View {
        VStack(spacing: Theme.Spacing.md) {
            if let error = localError ?? authViewModel.error {
                errorBanner(error)
            }

            TextField("Email", text: $email)
                .textFieldStyle(.roundedBorder)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
                .accessibilityLabel("Email address")

            SecureField("Password", text: $password)
                .textFieldStyle(.roundedBorder)
                .textContentType(.newPassword)
                .accessibilityLabel("Password")

            SecureField("Confirm Password", text: $confirmPassword)
                .textFieldStyle(.roundedBorder)
                .textContentType(.newPassword)
                .accessibilityLabel("Confirm password")

            if !password.isEmpty {
                passwordStrengthIndicator
            }

            PrimaryButton(
                title: "Create Account",
                isLoading: authViewModel.isLoading
            ) {
                createAccount()
            }
            .disabled(email.isEmpty || password.isEmpty || confirmPassword.isEmpty)
            .accessibilityLabel("Create account button")
        }
    }

    // MARK: - Password Strength

    private var passwordStrengthIndicator: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
            HStack(spacing: 4) {
                ForEach(0..<4) { index in
                    RoundedRectangle(cornerRadius: 2)
                        .fill(index < passwordStrength ? strengthColor : Color.secondary.opacity(0.2))
                        .frame(height: 4)
                }
            }
            Text(strengthLabel)
                .font(Theme.Typography.caption)
                .foregroundStyle(strengthColor)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Password strength: \(strengthLabel)")
    }

    private var passwordStrength: Int {
        var strength = 0
        if password.count >= 8 { strength += 1 }
        if password.rangeOfCharacter(from: .uppercaseLetters) != nil { strength += 1 }
        if password.rangeOfCharacter(from: .decimalDigits) != nil { strength += 1 }
        if password.rangeOfCharacter(from: .punctuationCharacters) != nil ||
           password.rangeOfCharacter(from: .symbols) != nil { strength += 1 }
        return strength
    }

    private var strengthLabel: String {
        switch passwordStrength {
        case 0...1: return "Weak"
        case 2: return "Fair"
        case 3: return "Good"
        default: return "Strong"
        }
    }

    private var strengthColor: Color {
        switch passwordStrength {
        case 0...1: return .red
        case 2: return .orange
        case 3: return .yellow
        default: return .green
        }
    }

    // MARK: - Divider

    private var dividerSection: some View {
        HStack {
            Rectangle()
                .frame(height: 1)
                .foregroundStyle(.quaternary)
            Text("or")
                .font(Theme.Typography.footnote)
                .foregroundStyle(.secondary)
            Rectangle()
                .frame(height: 1)
                .foregroundStyle(.quaternary)
        }
    }

    // MARK: - Apple Sign In

    private var appleSignInSection: some View {
        SignInWithAppleButton(.signUp) { request in
            let nonce = authViewModel.generateNonce()
            request.requestedScopes = [.fullName, .email]
            request.nonce = authViewModel.sha256(nonce)
        } onCompletion: { result in
            Task {
                await authViewModel.handleSignInWithApple(result)
            }
        }
        .signInWithAppleButtonStyle(.whiteOutline)
        .frame(height: 50)
        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))
        .accessibilityLabel("Sign up with Apple")
    }

    // MARK: - Terms

    private var termsSection: some View {
        VStack(spacing: Theme.Spacing.xs) {
            Text("By creating an account, you agree to our")
                .font(Theme.Typography.caption)
                .foregroundStyle(.secondary)
            HStack(spacing: Theme.Spacing.xs) {
                Link("Terms of Service", destination: Config.termsURL)
                Text("and")
                    .foregroundStyle(.secondary)
                Link("Privacy Policy", destination: Config.privacyURL)
            }
            .font(Theme.Typography.caption)
        }
        .multilineTextAlignment(.center)
        .padding(.bottom, Theme.Spacing.lg)
    }

    // MARK: - Actions

    private func createAccount() {
        localError = nil

        guard password == confirmPassword else {
            localError = "Passwords do not match."
            UINotificationFeedbackGenerator().notificationOccurred(.error)
            return
        }

        guard password.count >= 8 else {
            localError = "Password must be at least 8 characters."
            UINotificationFeedbackGenerator().notificationOccurred(.error)
            return
        }

        Task {
            await authViewModel.signUp(email: email, password: password)
        }
    }

    // MARK: - Error Banner

    private func errorBanner(_ message: String) -> some View {
        HStack(spacing: Theme.Spacing.sm) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.red)
                .accessibilityHidden(true)
            Text(message)
                .font(Theme.Typography.footnote)
                .foregroundStyle(.red)
            Spacer()
        }
        .padding(Theme.Spacing.sm)
        .background(.red.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.sm))
    }
}

#Preview {
    SignUpView()
        .environment(AuthViewModel())
}

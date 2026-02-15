import SwiftUI
import AuthenticationServices

struct SignInView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showForgotPassword = false
    @State private var showSignUp = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing.xl) {
                    headerSection
                    formSection
                    dividerSection
                    appleSignInSection
                    signUpSection
                }
                .padding(.horizontal, Theme.Spacing.lg)
                .padding(.top, Theme.Spacing.xxl)
            }
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showForgotPassword) {
                ForgotPasswordView()
            }
            .sheet(isPresented: $showSignUp) {
                SignUpView()
            }
            .onChange(of: authViewModel.error) { _, newValue in
                if newValue != nil {
                    UINotificationFeedbackGenerator().notificationOccurred(.error)
                }
            }
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(spacing: Theme.Spacing.sm) {
            Image(systemName: "bolt.shield.fill")
                .font(.system(size: 56))
                .foregroundStyle(Theme.Colors.primary)
                .accessibilityHidden(true)

            Text("Welcome Back")
                .font(Theme.Typography.largeTitle)
                .fontWeight(.bold)

            Text("Sign in to continue")
                .font(Theme.Typography.body)
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Form

    private var formSection: some View {
        VStack(spacing: Theme.Spacing.md) {
            if let error = authViewModel.error {
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
                .textContentType(.password)
                .accessibilityLabel("Password")

            HStack {
                Spacer()
                Button("Forgot password?") {
                    showForgotPassword = true
                }
                .font(Theme.Typography.footnote)
                .foregroundStyle(Theme.Colors.primary)
                .accessibilityLabel("Reset your password")
            }

            PrimaryButton(
                title: "Sign In",
                isLoading: authViewModel.isLoading
            ) {
                Task {
                    await authViewModel.signIn(email: email, password: password)
                }
            }
            .disabled(email.isEmpty || password.isEmpty)
            .accessibilityLabel("Sign in button")
            .accessibilityHint("Double tap to sign in with your email and password")
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
        SignInWithAppleButton(.signIn) { request in
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
        .accessibilityLabel("Sign in with Apple")
    }

    // MARK: - Sign Up

    private var signUpSection: some View {
        HStack(spacing: Theme.Spacing.xs) {
            Text("Don't have an account?")
                .font(Theme.Typography.footnote)
                .foregroundStyle(.secondary)
            Button("Create one") {
                showSignUp = true
            }
            .font(Theme.Typography.footnote)
            .fontWeight(.semibold)
            .foregroundStyle(Theme.Colors.primary)
            .accessibilityLabel("Create a new account")
        }
        .padding(.bottom, Theme.Spacing.lg)
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
            Button {
                authViewModel.clearError()
            } label: {
                Image(systemName: "xmark")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .accessibilityLabel("Dismiss error")
        }
        .padding(Theme.Spacing.sm)
        .background(.red.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.sm))
    }
}

#Preview {
    SignInView()
        .environment(AuthViewModel())
}

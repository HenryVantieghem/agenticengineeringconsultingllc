import SwiftUI

struct ForgotPasswordView: View {
    @Environment(AuthViewModel.self) private var authViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var emailSent = false

    var body: some View {
        NavigationStack {
            VStack(spacing: Theme.Spacing.xl) {
                if emailSent {
                    successContent
                } else {
                    formContent
                }

                Spacer()
            }
            .padding(.horizontal, Theme.Spacing.lg)
            .padding(.top, Theme.Spacing.xxl)
            .navigationTitle("Reset Password")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .accessibilityLabel("Cancel password reset")
                }
            }
        }
    }

    // MARK: - Form

    private var formContent: some View {
        VStack(spacing: Theme.Spacing.xl) {
            VStack(spacing: Theme.Spacing.sm) {
                Image(systemName: "key.fill")
                    .font(.system(size: 48))
                    .foregroundStyle(Theme.Colors.primary)
                    .accessibilityHidden(true)

                Text("Forgot your password?")
                    .font(Theme.Typography.title2)
                    .fontWeight(.bold)

                Text("Enter your email and we'll send you a link to reset your password.")
                    .font(Theme.Typography.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }

            VStack(spacing: Theme.Spacing.md) {
                if let error = authViewModel.error {
                    HStack(spacing: Theme.Spacing.sm) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red)
                            .accessibilityHidden(true)
                        Text(error)
                            .font(Theme.Typography.footnote)
                            .foregroundStyle(.red)
                        Spacer()
                    }
                    .padding(Theme.Spacing.sm)
                    .background(.red.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.sm))
                }

                TextField("Email", text: $email)
                    .textFieldStyle(.roundedBorder)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .accessibilityLabel("Email address")

                PrimaryButton(
                    title: "Send Reset Link",
                    isLoading: authViewModel.isLoading
                ) {
                    Task {
                        await authViewModel.resetPassword(email: email)
                        if authViewModel.error == nil {
                            withAnimation {
                                emailSent = true
                            }
                        }
                    }
                }
                .disabled(email.isEmpty)
                .accessibilityLabel("Send password reset link")
            }
        }
    }

    // MARK: - Success

    private var successContent: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Image(systemName: "envelope.badge.fill")
                .font(.system(size: 56))
                .foregroundStyle(.green)
                .accessibilityHidden(true)

            Text("Check Your Email")
                .font(Theme.Typography.title2)
                .fontWeight(.bold)

            Text("We sent a password reset link to **\(email)**. Check your inbox and follow the instructions.")
                .font(Theme.Typography.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            PrimaryButton(title: "Back to Sign In") {
                dismiss()
            }
            .padding(.top, Theme.Spacing.md)
            .accessibilityLabel("Return to sign in screen")
        }
    }
}

#Preview {
    ForgotPasswordView()
        .environment(AuthViewModel())
}

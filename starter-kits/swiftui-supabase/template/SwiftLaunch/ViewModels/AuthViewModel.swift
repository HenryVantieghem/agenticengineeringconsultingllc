import Foundation
import Supabase
import AuthenticationServices
import CryptoKit

@Observable
final class AuthViewModel {
    var session: Session?
    var isLoading = false
    var error: String?
    var isAuthenticated: Bool { session != nil }
    var showEmailVerification = false

    private let supabase = SupabaseService.shared
    private var authListener: Task<Void, Never>?
    private var currentNonce: String?

    init() {
        startAuthListener()
    }

    deinit {
        authListener?.cancel()
    }

    // MARK: - Auth State Listener

    private func startAuthListener() {
        authListener = Task { [weak self] in
            guard let self else { return }

            if let existingSession = await supabase.currentSession {
                await MainActor.run {
                    self.session = existingSession
                }
            }

            for await (event, session) in supabase.client.auth.authStateChanges {
                guard !Task.isCancelled else { return }
                await MainActor.run {
                    switch event {
                    case .signedIn:
                        self.session = session
                        self.error = nil
                    case .signedOut:
                        self.session = nil
                    case .tokenRefreshed:
                        self.session = session
                    default:
                        break
                    }
                }
            }
        }
    }

    // MARK: - Email Auth

    func signIn(email: String, password: String) async {
        guard validateEmail(email), !password.isEmpty else {
            error = "Please enter a valid email and password."
            return
        }

        isLoading = true
        error = nil

        do {
            let session = try await supabase.signIn(email: email, password: password)
            await MainActor.run {
                self.session = session
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = self.friendlyError(from: error)
                self.isLoading = false
            }
        }
    }

    func signUp(email: String, password: String) async {
        guard validateEmail(email) else {
            error = "Please enter a valid email address."
            return
        }

        guard password.count >= 8 else {
            error = "Password must be at least 8 characters."
            return
        }

        isLoading = true
        error = nil

        do {
            let session = try await supabase.signUp(email: email, password: password)
            await MainActor.run {
                self.session = session
                self.isLoading = false
            }
        } catch let swiftLaunchError as SwiftLaunchError {
            await MainActor.run {
                self.error = swiftLaunchError.localizedDescription
                self.showEmailVerification = true
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = self.friendlyError(from: error)
                self.isLoading = false
            }
        }
    }

    func signOut() async {
        isLoading = true
        do {
            try await supabase.signOut()
            await MainActor.run {
                self.session = nil
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = self.friendlyError(from: error)
                self.isLoading = false
            }
        }
    }

    func resetPassword(email: String) async {
        guard validateEmail(email) else {
            error = "Please enter a valid email address."
            return
        }

        isLoading = true
        error = nil

        do {
            try await supabase.resetPassword(email: email)
            await MainActor.run {
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = self.friendlyError(from: error)
                self.isLoading = false
            }
        }
    }

    // MARK: - Sign in with Apple

    func handleSignInWithApple(_ result: Result<ASAuthorization, Error>) async {
        switch result {
        case .success(let authorization):
            guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let identityTokenData = credential.identityToken,
                  let identityToken = String(data: identityTokenData, encoding: .utf8),
                  let nonce = currentNonce else {
                error = "Failed to process Apple Sign In credentials."
                return
            }

            isLoading = true
            error = nil

            do {
                let session = try await supabase.signInWithApple(idToken: identityToken, nonce: nonce)
                await MainActor.run {
                    self.session = session
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.error = self.friendlyError(from: error)
                    self.isLoading = false
                }
            }

        case .failure(let error):
            if (error as NSError).code != ASAuthorizationError.canceled.rawValue {
                self.error = "Apple Sign In failed. Please try again."
            }
        }
    }

    func generateNonce() -> String {
        let nonce = randomNonceString()
        currentNonce = nonce
        return nonce
    }

    func sha256(_ input: String) -> String {
        let inputData = Data(input.utf8)
        let hashedData = SHA256.hash(data: inputData)
        return hashedData.compactMap { String(format: "%02x", $0) }.joined()
    }

    // MARK: - Delete Account

    func deleteAccount() async throws {
        guard let userId = await supabase.currentUserID else {
            throw SwiftLaunchError.authError("No active session.")
        }

        try await supabase.delete(
            from: "profiles",
            filter: { $0.eq("id", value: userId.uuidString) }
        )

        try await supabase.signOut()

        await MainActor.run {
            self.session = nil
        }
    }

    // MARK: - Helpers

    func clearError() {
        error = nil
    }

    private func validateEmail(_ email: String) -> Bool {
        let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        return email.wholeMatch(of: emailRegex) != nil
    }

    private func friendlyError(from error: Error) -> String {
        let message = error.localizedDescription.lowercased()
        if message.contains("invalid login") || message.contains("invalid credentials") {
            return "Invalid email or password. Please try again."
        }
        if message.contains("email not confirmed") {
            return "Please verify your email address before signing in."
        }
        if message.contains("already registered") || message.contains("already exists") {
            return "An account with this email already exists."
        }
        if message.contains("network") || message.contains("connection") {
            return "Network error. Please check your connection and try again."
        }
        return "Something went wrong. Please try again."
    }

    private func randomNonceString(length: Int = 32) -> String {
        precondition(length > 0)
        var randomBytes = [UInt8](repeating: 0, count: length)
        let errorCode = SecRandomCopyBytes(kSecRandomDefault, randomBytes.count, &randomBytes)
        guard errorCode == errSecSuccess else {
            fatalError("Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)")
        }
        let charset: [Character] = Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
        return String(randomBytes.map { charset[Int($0) % charset.count] })
    }
}

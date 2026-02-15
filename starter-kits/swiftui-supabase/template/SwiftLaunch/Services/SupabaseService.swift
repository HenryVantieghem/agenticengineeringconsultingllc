import Foundation
import Supabase
import AuthenticationServices

final class SupabaseService: Sendable {
    static let shared = SupabaseService()

    let client: SupabaseClient

    private init() {
        client = SupabaseClient(
            supabaseURL: Config.supabaseURL,
            supabaseKey: Config.supabaseAnonKey
        )
    }

    // MARK: - Auth

    func signIn(email: String, password: String) async throws -> Session {
        try await client.auth.signIn(email: email, password: password)
    }

    func signUp(email: String, password: String) async throws -> Session {
        let response = try await client.auth.signUp(email: email, password: password)
        guard let session = response.session else {
            throw SwiftLaunchError.authError("Account created. Please check your email to verify your account.")
        }
        return session
    }

    func signInWithApple(idToken: String, nonce: String) async throws -> Session {
        try await client.auth.signInWithIdToken(
            credentials: .init(provider: .apple, idToken: idToken, nonce: nonce)
        )
    }

    func signOut() async throws {
        try await client.auth.signOut()
    }

    func resetPassword(email: String) async throws {
        try await client.auth.resetPasswordForEmail(email)
    }

    var currentSession: Session? {
        get async {
            try? await client.auth.session
        }
    }

    var currentUserID: UUID? {
        get async {
            try? await client.auth.session.user.id
        }
    }

    // MARK: - Database

    func fetch<T: Decodable>(
        from table: String,
        select: String = "*",
        filter: ((PostgrestFilterBuilder) -> PostgrestFilterBuilder)? = nil,
        order: String? = nil,
        ascending: Bool = false,
        limit: Int? = nil
    ) async throws -> [T] {
        var query = client.from(table).select(select)

        if let filter {
            query = filter(query)
        }

        if let order {
            query = query.order(order, ascending: ascending)
        }

        if let limit {
            query = query.limit(limit)
        }

        return try await query.execute().value
    }

    func fetchSingle<T: Decodable>(
        from table: String,
        select: String = "*",
        filter: (PostgrestFilterBuilder) -> PostgrestFilterBuilder
    ) async throws -> T {
        try await filter(client.from(table).select(select)).single().execute().value
    }

    func insert<T: Encodable>(into table: String, values: T) async throws {
        try await client.from(table).insert(values).execute()
    }

    func insertAndReturn<T: Encodable, R: Decodable>(into table: String, values: T) async throws -> R {
        try await client.from(table).insert(values).select().single().execute().value
    }

    func update<T: Encodable>(
        table: String,
        values: T,
        filter: (PostgrestFilterBuilder) -> PostgrestFilterBuilder
    ) async throws {
        try await filter(client.from(table).update(values)).execute()
    }

    func delete(
        from table: String,
        filter: (PostgrestFilterBuilder) -> PostgrestFilterBuilder
    ) async throws {
        try await filter(client.from(table).delete()).execute()
    }

    // MARK: - Storage

    func uploadFile(
        bucket: String,
        path: String,
        data: Data,
        contentType: String = "image/jpeg"
    ) async throws -> String {
        try await client.storage
            .from(bucket)
            .upload(
                path: path,
                file: data,
                options: FileOptions(contentType: contentType, upsert: true)
            )

        let publicURL = try client.storage
            .from(bucket)
            .getPublicURL(path: path)

        return publicURL.absoluteString
    }

    func deleteFile(bucket: String, paths: [String]) async throws {
        try await client.storage.from(bucket).remove(paths: paths)
    }

    // MARK: - Realtime

    func subscribeToChanges(
        table: String,
        event: RealtimeChannel.PostgresChange = .all,
        filter: String? = nil,
        onChange: @escaping @Sendable (any PostgresAction) -> Void
    ) -> RealtimeChannelV2 {
        let channel = client.realtimeV2.channel("public:\(table)")

        let insertion = channel.postgresChange(
            AnyAction.self,
            schema: "public",
            table: table,
            filter: filter
        )

        Task {
            for await action in insertion {
                onChange(action)
            }
        }

        Task {
            await channel.subscribe()
        }

        return channel
    }

    func unsubscribe(channel: RealtimeChannelV2) {
        Task {
            await channel.unsubscribe()
        }
    }
}

// MARK: - Error Types

enum SwiftLaunchError: LocalizedError {
    case authError(String)
    case databaseError(String)
    case storageError(String)
    case networkError(String)
    case unknown(String)

    var errorDescription: String? {
        switch self {
        case .authError(let message): return message
        case .databaseError(let message): return message
        case .storageError(let message): return message
        case .networkError(let message): return message
        case .unknown(let message): return message
        }
    }
}

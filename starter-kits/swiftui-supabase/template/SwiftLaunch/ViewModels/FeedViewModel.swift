import Foundation
import Supabase

@Observable
final class FeedViewModel {
    var posts: [Post] = []
    var isLoading = false
    var isRefreshing = false
    var error: String?

    private let supabase = SupabaseService.shared
    private var realtimeChannel: RealtimeChannelV2?

    // MARK: - Fetch Posts

    func fetchPosts() async {
        guard !isRefreshing else { return }
        isLoading = posts.isEmpty
        error = nil

        do {
            let fetchedPosts: [Post] = try await supabase.fetch(
                from: "posts",
                select: "*, profiles(*)",
                order: "created_at",
                ascending: false,
                limit: 50
            )
            await MainActor.run {
                self.posts = fetchedPosts
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = "Failed to load posts. Pull to refresh."
                self.isLoading = false
            }
        }
    }

    func refreshPosts() async {
        isRefreshing = true
        error = nil

        do {
            let fetchedPosts: [Post] = try await supabase.fetch(
                from: "posts",
                select: "*, profiles(*)",
                order: "created_at",
                ascending: false,
                limit: 50
            )
            await MainActor.run {
                self.posts = fetchedPosts
                self.isRefreshing = false
            }
        } catch {
            await MainActor.run {
                self.error = "Failed to refresh posts."
                self.isRefreshing = false
            }
        }
    }

    // MARK: - Create Post

    func createPost(content: String, imageData: Data?) async throws {
        guard let userId = await supabase.currentUserID else {
            throw SwiftLaunchError.authError("You must be signed in to create a post.")
        }

        var imageUrl: String?

        if let imageData {
            let fileName = "\(userId.uuidString)/\(UUID().uuidString).jpg"
            imageUrl = try await supabase.uploadFile(
                bucket: Config.Storage.postImagesBucket,
                path: fileName,
                data: imageData
            )
        }

        let newPost = PostInsert(
            userId: userId,
            content: content,
            imageUrl: imageUrl
        )

        try await supabase.insert(into: "posts", values: newPost)
        await fetchPosts()
    }

    // MARK: - Delete Post

    func deletePost(_ post: Post) async throws {
        if let imageUrl = post.imageUrl, let path = extractStoragePath(from: imageUrl) {
            try? await supabase.deleteFile(
                bucket: Config.Storage.postImagesBucket,
                paths: [path]
            )
        }

        try await supabase.delete(
            from: "posts",
            filter: { $0.eq("id", value: post.id.uuidString) }
        )

        await MainActor.run {
            self.posts.removeAll { $0.id == post.id }
        }
    }

    // MARK: - Like Post

    func toggleLike(_ post: Post) async throws {
        guard let userId = await supabase.currentUserID else { return }

        let likes: [LikeRecord] = try await supabase.fetch(
            from: "post_likes",
            filter: {
                $0.eq("post_id", value: post.id.uuidString)
                    .eq("user_id", value: userId.uuidString)
            }
        )

        if likes.isEmpty {
            try await supabase.insert(
                into: "post_likes",
                values: ["post_id": post.id.uuidString, "user_id": userId.uuidString]
            )
        } else {
            try await supabase.delete(
                from: "post_likes",
                filter: {
                    $0.eq("post_id", value: post.id.uuidString)
                        .eq("user_id", value: userId.uuidString)
                }
            )
        }

        await fetchPosts()
    }

    // MARK: - Realtime

    func subscribeToChanges() {
        realtimeChannel = supabase.subscribeToChanges(table: "posts") { [weak self] _ in
            Task { [weak self] in
                await self?.fetchPosts()
            }
        }
    }

    func unsubscribeFromChanges() {
        if let channel = realtimeChannel {
            supabase.unsubscribe(channel: channel)
            realtimeChannel = nil
        }
    }

    // MARK: - Helpers

    private func extractStoragePath(from url: String) -> String? {
        guard let range = url.range(of: "/storage/v1/object/public/\(Config.Storage.postImagesBucket)/") else {
            return nil
        }
        return String(url[range.upperBound...])
    }
}

private struct LikeRecord: Codable {
    let postId: UUID
    let userId: UUID

    enum CodingKeys: String, CodingKey {
        case postId = "post_id"
        case userId = "user_id"
    }
}

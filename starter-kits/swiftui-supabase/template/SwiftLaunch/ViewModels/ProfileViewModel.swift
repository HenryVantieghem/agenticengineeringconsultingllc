import Foundation
import Supabase

@Observable
final class ProfileViewModel {
    var profile: Profile?
    var userPosts: [Post] = []
    var isLoading = false
    var isSaving = false
    var error: String?

    private let supabase = SupabaseService.shared

    // MARK: - Fetch Profile

    func fetchProfile() async {
        guard let userId = await supabase.currentUserID else { return }
        await fetchProfile(userId: userId)
    }

    func fetchProfile(userId: UUID) async {
        isLoading = profile == nil
        error = nil

        do {
            let fetchedProfile: Profile = try await supabase.fetchSingle(
                from: "profiles",
                filter: { $0.eq("id", value: userId.uuidString) }
            )

            let fetchedPosts: [Post] = try await supabase.fetch(
                from: "posts",
                select: "*, profiles(*)",
                filter: { $0.eq("user_id", value: userId.uuidString) },
                order: "created_at",
                ascending: false
            )

            await MainActor.run {
                self.profile = fetchedProfile
                self.userPosts = fetchedPosts
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = "Failed to load profile."
                self.isLoading = false
            }
        }
    }

    // MARK: - Update Profile

    func updateProfile(username: String?, fullName: String?, bio: String?) async throws {
        guard let userId = await supabase.currentUserID else {
            throw SwiftLaunchError.authError("You must be signed in.")
        }

        isSaving = true
        defer { isSaving = false }

        let update = ProfileUpdate(
            username: username,
            fullName: fullName,
            bio: bio
        )

        try await supabase.update(
            table: "profiles",
            values: update,
            filter: { $0.eq("id", value: userId.uuidString) }
        )

        await fetchProfile(userId: userId)
    }

    // MARK: - Upload Avatar

    func uploadAvatar(imageData: Data) async throws {
        guard let userId = await supabase.currentUserID else {
            throw SwiftLaunchError.authError("You must be signed in.")
        }

        isSaving = true

        do {
            let fileName = "\(userId.uuidString)/avatar.jpg"
            let publicUrl = try await supabase.uploadFile(
                bucket: Config.Storage.avatarsBucket,
                path: fileName,
                data: imageData
            )

            let update = ProfileUpdate(avatarUrl: publicUrl)
            try await supabase.update(
                table: "profiles",
                values: update,
                filter: { $0.eq("id", value: userId.uuidString) }
            )

            await fetchProfile(userId: userId)

            await MainActor.run {
                self.isSaving = false
            }
        } catch {
            await MainActor.run {
                self.isSaving = false
                self.error = "Failed to upload avatar."
            }
            throw error
        }
    }

    // MARK: - Stats

    var postCount: Int {
        userPosts.count
    }

    var totalLikes: Int {
        userPosts.reduce(0) { $0 + $1.likesCount }
    }
}

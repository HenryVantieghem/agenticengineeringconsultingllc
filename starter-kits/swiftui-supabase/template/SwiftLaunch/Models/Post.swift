import Foundation

struct Post: Codable, Identifiable, Sendable {
    let id: UUID
    let userId: UUID
    var content: String
    var imageUrl: String?
    var likesCount: Int
    let createdAt: Date

    var profile: Profile?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case content
        case imageUrl = "image_url"
        case likesCount = "likes_count"
        case createdAt = "created_at"
        case profile = "profiles"
    }

    var timeAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: createdAt, relativeTo: Date())
    }
}

struct PostInsert: Codable, Sendable {
    let userId: UUID
    let content: String
    let imageUrl: String?

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case content
        case imageUrl = "image_url"
    }
}

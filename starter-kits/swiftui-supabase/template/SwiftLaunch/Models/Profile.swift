import Foundation

struct Profile: Codable, Identifiable, Sendable {
    let id: UUID
    var username: String?
    var fullName: String?
    var avatarUrl: String?
    var bio: String?
    let createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case username
        case fullName = "full_name"
        case avatarUrl = "avatar_url"
        case bio
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }

    var displayName: String {
        fullName ?? username ?? "Anonymous"
    }

    var initials: String {
        let name = displayName
        let components = name.split(separator: " ")
        if components.count >= 2 {
            return String(components[0].prefix(1) + components[1].prefix(1)).uppercased()
        }
        return String(name.prefix(2)).uppercased()
    }
}

struct ProfileUpdate: Codable, Sendable {
    var username: String?
    var fullName: String?
    var avatarUrl: String?
    var bio: String?
    let updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case username
        case fullName = "full_name"
        case avatarUrl = "avatar_url"
        case bio
        case updatedAt = "updated_at"
    }

    init(username: String? = nil, fullName: String? = nil, avatarUrl: String? = nil, bio: String? = nil) {
        self.username = username
        self.fullName = fullName
        self.avatarUrl = avatarUrl
        self.bio = bio
        self.updatedAt = Date()
    }
}

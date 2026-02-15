import Foundation

struct AppNotification: Codable, Identifiable, Sendable {
    let id: UUID
    let userId: UUID
    let type: NotificationType
    let title: String
    let body: String?
    let referenceId: UUID?
    var isRead: Bool
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case type
        case title
        case body
        case referenceId = "reference_id"
        case isRead = "is_read"
        case createdAt = "created_at"
    }

    var icon: String {
        switch type {
        case .like:
            return "heart.fill"
        case .comment:
            return "bubble.left.fill"
        case .follow:
            return "person.badge.plus"
        case .system:
            return "bell.fill"
        case .subscription:
            return "star.fill"
        }
    }

    var timeAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: createdAt, relativeTo: Date())
    }
}

enum NotificationType: String, Codable, Sendable {
    case like
    case comment
    case follow
    case system
    case subscription
}

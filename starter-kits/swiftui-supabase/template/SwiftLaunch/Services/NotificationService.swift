import Foundation
import UserNotifications
import UIKit

final class NotificationService: Sendable {
    static let shared = NotificationService()

    private init() {}

    // MARK: - Permission

    func requestPermission() async -> Bool {
        do {
            let granted = try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .badge, .sound])

            if granted {
                await MainActor.run {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }

            return granted
        } catch {
            print("[SwiftLaunch] Notification permission error: \(error.localizedDescription)")
            return false
        }
    }

    func checkPermissionStatus() async -> UNAuthorizationStatus {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        return settings.authorizationStatus
    }

    // MARK: - Token Registration

    func registerDeviceToken(_ token: String) async {
        guard let userId = await SupabaseService.shared.currentUserID else { return }

        do {
            try await SupabaseService.shared.client.from("device_tokens")
                .upsert(
                    [
                        "user_id": userId.uuidString,
                        "token": token,
                        "platform": "ios",
                        "updated_at": ISO8601DateFormatter().string(from: Date())
                    ],
                    onConflict: "user_id, token"
                )
                .execute()
        } catch {
            print("[SwiftLaunch] Failed to register device token: \(error.localizedDescription)")
        }
    }

    // MARK: - Notification Handling

    func handleNotificationTap(userInfo: [AnyHashable: Any]) {
        guard let type = userInfo["type"] as? String else { return }

        switch type {
        case "post":
            if let postId = userInfo["post_id"] as? String {
                NotificationCenter.default.post(
                    name: .navigateToPost,
                    object: nil,
                    userInfo: ["postId": postId]
                )
            }
        case "profile":
            if let profileId = userInfo["profile_id"] as? String {
                NotificationCenter.default.post(
                    name: .navigateToProfile,
                    object: nil,
                    userInfo: ["profileId": profileId]
                )
            }
        default:
            break
        }
    }

    // MARK: - Badge

    func clearBadge() async {
        await MainActor.run {
            UNUserNotificationCenter.current().setBadgeCount(0)
        }
    }

    // MARK: - Mark as Read

    func markAsRead(notificationId: UUID) async throws {
        try await SupabaseService.shared.update(
            table: "notifications",
            values: ["is_read": true],
            filter: { $0.eq("id", value: notificationId.uuidString) }
        )
    }

    func markAllAsRead(userId: UUID) async throws {
        try await SupabaseService.shared.update(
            table: "notifications",
            values: ["is_read": true],
            filter: { $0.eq("user_id", value: userId.uuidString).eq("is_read", value: false) }
        )
    }
}

// MARK: - Notification Names

extension Notification.Name {
    static let navigateToPost = Notification.Name("navigateToPost")
    static let navigateToProfile = Notification.Name("navigateToProfile")
}

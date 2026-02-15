import Foundation
import Supabase

@Observable
final class NotificationViewModel {
    var notifications: [AppNotification] = []
    var isLoading = false
    var error: String?

    private let supabase = SupabaseService.shared
    private var realtimeChannel: RealtimeChannelV2?

    var unreadCount: Int {
        notifications.filter { !$0.isRead }.count
    }

    var hasUnread: Bool {
        unreadCount > 0
    }

    // MARK: - Fetch Notifications

    func fetchNotifications() async {
        guard let userId = await supabase.currentUserID else { return }

        isLoading = notifications.isEmpty
        error = nil

        do {
            let fetched: [AppNotification] = try await supabase.fetch(
                from: "notifications",
                filter: { $0.eq("user_id", value: userId.uuidString) },
                order: "created_at",
                ascending: false,
                limit: 50
            )

            await MainActor.run {
                self.notifications = fetched
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = "Failed to load notifications."
                self.isLoading = false
            }
        }
    }

    // MARK: - Mark as Read

    func markAsRead(_ notification: AppNotification) async {
        guard !notification.isRead else { return }

        do {
            try await NotificationService.shared.markAsRead(notificationId: notification.id)

            await MainActor.run {
                if let index = self.notifications.firstIndex(where: { $0.id == notification.id }) {
                    self.notifications[index].isRead = true
                }
            }
        } catch {
            print("[SwiftLaunch] Failed to mark notification as read: \(error.localizedDescription)")
        }
    }

    func markAllAsRead() async {
        guard let userId = await supabase.currentUserID else { return }

        do {
            try await NotificationService.shared.markAllAsRead(userId: userId)

            await MainActor.run {
                for index in self.notifications.indices {
                    self.notifications[index].isRead = true
                }
            }

            await NotificationService.shared.clearBadge()
        } catch {
            print("[SwiftLaunch] Failed to mark all notifications as read: \(error.localizedDescription)")
        }
    }

    // MARK: - Realtime

    func subscribeToChanges() {
        Task {
            guard let userId = await supabase.currentUserID else { return }

            realtimeChannel = supabase.subscribeToChanges(
                table: "notifications",
                filter: "user_id=eq.\(userId.uuidString)"
            ) { [weak self] _ in
                Task { [weak self] in
                    await self?.fetchNotifications()
                }
            }
        }
    }

    func unsubscribeFromChanges() {
        if let channel = realtimeChannel {
            supabase.unsubscribe(channel: channel)
            realtimeChannel = nil
        }
    }
}

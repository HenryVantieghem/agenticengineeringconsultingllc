import SwiftUI

struct NotificationsView: View {
    @Environment(NotificationViewModel.self) private var viewModel

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.notifications.isEmpty {
                    EmptyStateView(
                        icon: "bell.slash",
                        title: "No Notifications",
                        message: "You're all caught up. New notifications will appear here."
                    )
                } else {
                    notificationList
                }
            }
            .navigationTitle("Notifications")
            .toolbar {
                if viewModel.hasUnread {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Mark All Read") {
                            Task { await viewModel.markAllAsRead() }
                        }
                        .font(Theme.Typography.footnote)
                        .accessibilityLabel("Mark all notifications as read")
                    }
                }
            }
            .refreshable {
                await viewModel.fetchNotifications()
            }
        }
    }

    // MARK: - List

    private var notificationList: some View {
        List(viewModel.notifications) { notification in
            notificationRow(notification)
                .listRowBackground(notification.isRead ? Color.clear : Theme.Colors.primary.opacity(0.05))
                .swipeActions(edge: .trailing) {
                    if !notification.isRead {
                        Button {
                            Task { await viewModel.markAsRead(notification) }
                        } label: {
                            Label("Read", systemImage: "envelope.open")
                        }
                        .tint(.blue)
                    }
                }
        }
        .listStyle(.plain)
    }

    // MARK: - Row

    private func notificationRow(_ notification: AppNotification) -> some View {
        HStack(spacing: Theme.Spacing.md) {
            ZStack {
                Circle()
                    .fill(iconColor(for: notification.type).opacity(0.15))
                    .frame(width: 40, height: 40)

                Image(systemName: notification.icon)
                    .font(.system(size: 16))
                    .foregroundStyle(iconColor(for: notification.type))
            }
            .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 4) {
                Text(notification.title)
                    .font(Theme.Typography.subheadline)
                    .fontWeight(notification.isRead ? .regular : .semibold)

                if let body = notification.body {
                    Text(body)
                        .font(Theme.Typography.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }

                Text(notification.timeAgo)
                    .font(Theme.Typography.caption)
                    .foregroundStyle(.tertiary)
            }

            Spacer()

            if !notification.isRead {
                Circle()
                    .fill(Theme.Colors.primary)
                    .frame(width: 8, height: 8)
                    .accessibilityLabel("Unread")
            }
        }
        .padding(.vertical, Theme.Spacing.xs)
        .contentShape(Rectangle())
        .onTapGesture {
            Task { await viewModel.markAsRead(notification) }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(notification.isRead ? "" : "Unread. ")\(notification.title). \(notification.body ?? "")")
    }

    // MARK: - Loading

    private var loadingView: some View {
        ScrollView {
            LazyVStack(spacing: Theme.Spacing.sm) {
                ForEach(0..<8, id: \.self) { _ in
                    ShimmerView()
                        .frame(height: 72)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.sm))
                }
            }
            .padding(Theme.Spacing.md)
        }
    }

    // MARK: - Helpers

    private func iconColor(for type: NotificationType) -> Color {
        switch type {
        case .like: return .red
        case .comment: return .blue
        case .follow: return .green
        case .system: return .orange
        case .subscription: return .purple
        }
    }
}

#Preview {
    NotificationsView()
        .environment(NotificationViewModel())
}

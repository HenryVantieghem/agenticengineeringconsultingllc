import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0
    @State private var feedViewModel = FeedViewModel()
    @State private var profileViewModel = ProfileViewModel()
    @State private var notificationViewModel = NotificationViewModel()

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Home", systemImage: "house.fill", value: 0) {
                FeedView()
                    .environment(feedViewModel)
            }
            .accessibilityLabel("Home feed tab")

            Tab("Search", systemImage: "magnifyingglass", value: 1) {
                SearchView()
            }
            .accessibilityLabel("Search tab")

            Tab("Create", systemImage: "plus.circle.fill", value: 2) {
                CreatePostView()
                    .environment(feedViewModel)
            }
            .accessibilityLabel("Create new post tab")

            Tab("Alerts", systemImage: "bell.fill", value: 3) {
                NotificationsView()
                    .environment(notificationViewModel)
            }
            .badge(notificationViewModel.unreadCount)
            .accessibilityLabel("Notifications tab, \(notificationViewModel.unreadCount) unread")

            Tab("Profile", systemImage: "person.fill", value: 4) {
                ProfileView()
                    .environment(profileViewModel)
            }
            .accessibilityLabel("Profile tab")
        }
        .tint(Theme.Colors.primary)
        .task {
            await feedViewModel.fetchPosts()
            await profileViewModel.fetchProfile()
            await notificationViewModel.fetchNotifications()
            feedViewModel.subscribeToChanges()
            notificationViewModel.subscribeToChanges()
        }
    }
}

#Preview {
    MainTabView()
        .environment(AuthViewModel())
        .environment(StoreViewModel())
}
